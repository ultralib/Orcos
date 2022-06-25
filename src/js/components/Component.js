/*
    Credits: qrai/Componently
    URL: https://raw.githubusercontent.com/qrai/Componently/main/src/framework/Component.js
*/
export default function Component(tag, component) {
	const _class = new component()

	// Generate tag if null
	tag = tag || 'component-' + (() => {
        const length = 6
        const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'

        let randomChars = ''
        for (let i = 0; i < length; i++ ) {
            randomChars += chars.charAt(Math.floor(Math.random() * chars.length))
        }
        return randomChars
	})()

	// Make class
	let ComponentClass = class extends HTMLElement {
		static get $tag() {
			return tag
		}

		constructor() {
			super()
	
			// Shadow DOM
			this.$shadow = this.attachShadow({ mode: 'closed' })
			this.$shadow.addEventListener('slotchange', this.$render)
	
			// Events
			this.$handlers = {}
			if(_class.events && typeof _class.events === 'function') {
				this.$handlers = _class.events.bind(this)()

				Object.keys(this.$handlers).forEach(eventName => {
					this.addEventListener(eventName, () => {
						this.$handlers[eventName]?.bind(this)()
					})
				})
			}
	
			// Props
			this.$props = {}
			if(_class.props && typeof _class.props === 'function') {
				this.$propsTranformers = _class.props.bind(this)()

				// Set props value based on initial attributes
				Object.keys(this.$propsTranformers).forEach(propName => {
					this.$props[propName] = this.#transformProperty(propName, this.getAttribute(propName))
				})
			}

			// State
			this.$state = new Proxy(_class.state?.bind(this)() || {}, {
				get: (target, name) => target[name],
				set: (target, name, value) => {
					if(target[name] !== undefined) {
						// Update value
						target[name] = value
						// Rerender
						this.$render()
						// Success
						return true
					}
					else
						return false
				}
			})

			// Methods
			this.$methods = {}
			if(_class.methods && typeof _class.methods === 'function') {
				this.$methods = _class.methods.bind(this)()
			}

			// Style
			this.$style = undefined
			if(_class.style && typeof _class.style === 'function') {
				// Create style element
				this.$style = document.createElement('style')
				this.$style.setAttribute('scoped', '')
				// Paste style() CSS coe to style element
				this.$style.innerHTML = _class.style.bind(this)()
			}

			// Initial render
			this.$render()
		}

		#transformProperty(propName, propValue) {
			if(!propName || !propValue)
				return null
			else
				return this.$propsTranformers[propName] ? this.$propsTranformers[propName](propValue) : null
		}

		#process() {
			const findReferences = () => {
				let refs = {}
				this.$shadow.querySelectorAll('[id]').forEach(refElement => {
					refs[refElement.getAttribute('id')] = refElement
				})
				return refs
			}
			const handleElements = () => {
				const events = [
					'click', 'dblclick',
					'focus', 'blur',
					'input', 'change', 'submit'
				]
			
				const walk = (el) => {
					// Current element
					events.forEach(eventName => {
						// Event handling
						if(el.hasAttribute?.(`@${eventName}`)) {
							el.addEventListener(
								eventName, 
								(e) => this.$methods[el.getAttribute?.(`@${eventName}`)].bind(this)(e)
							)
						}
					})
			
					// Walk childs
					el.children?.forEach?.(child => walk(child))
				}

				this.$shadow.childNodes.forEach(child => walk(child))
			}

			// Find references and set to $refs
			this.$refs = findReferences()
			// Walk all elements and process them
			handleElements()
		}

		$render() {
			console.log(this, this.$shadow, this.parentNode)

			// Move from inner to shadow
			this.$shadow.innerHTML = _class.render?.bind(this)() || ''
			// Replace slots
			this.$shadow.querySelectorAll('slot').forEach(slotEl => {
				try {
					// Named slots
					if(slotEl.hasAttribute('name')) {
						let slotted = this.querySelector(`[as="${slotEl.getAttribute('name')}"]`)
						slotted.removeAttribute('as')
						slotEl.replaceWith(slotted)
					}
					// Basic slot
					else {
						slotEl.outerHTML = this.innerHTML
					}
				}
				catch {}
			})
	
			// Clear inner
			this.innerHTML = ''

			// Attach style
			if(this.$style) {
				this.$shadow.appendChild(this.$style)
			}

			// Process inner HTML (References, Events, etc)
			this.#process()

			// Emit render()
			this.$emit('render')
		}
	
		$emit(eventName, argument) {
			let coreEvents = [
				'mounted',
				'unmounted',
				'adopted',
				'render'
			]
	
			// Core events
			if(coreEvents.includes(eventName))
				_class[eventName]?.bind(this)()
			// HTML events
			else
				this.dispatchEvent(new CustomEvent(eventName, argument))
		}
	
		connectedCallback() {
			this.$emit('mounted')
		}
		disconnectedCallback() {
			this.$emit('unmounted')
		}
		adoptedCallback() {
			this.$emit('adopted')
		}
		attributeChangedCallback(attr, oldValue, newValue) {
			// Property exists in props
			if(_class.props && _class.props[attr]) {
				// Set value of prop in $props
				this.$props[propName] = this.#transformProperty(attr, newValue)
			}
		}
	}

	// Define (If not defined yet)
	if(!window.customElements.get(tag))
		window.customElements.define(tag, ComponentClass)

	return ComponentClass
}