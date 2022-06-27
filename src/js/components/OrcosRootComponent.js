import Utils from "./Utils"

export const OrcosRootComponent = class extends HTMLElement {
    constructor() {
        super()
    }

    unselect() {
        // Self
        if(this.hasAttribute('selected'))
            this.removeAttribute('selected')
        // Childs
        else
            this.querySelector('[selected]')?.removeAttribute('selected')
    }

    emit(eventName, element) {
        // Make event
        let event = new CustomEvent(eventName, {
            detail: {
                root: this,
                element: element,
                linked: document.querySelector(`[orcos-link="${element.getAttribute('orcos-linked')}"]`),
            }
        })
        // Dispatch to tree
        this.dispatchEvent(event)
    }

    useTemplate(template) {
        this.setAttribute('style', template.baseStyle || '')
        this.innerHTML = template.inner || ''
    }

    processElement(el) {
        // If its text => make text editable
        if(Utils.textualTags.includes(el.tagName)) {
            el.setAttribute('contenteditable', '')
            el.addEventListener('input', (e) => {
                this.emit('nodeedit', e.target)
            })
        }

        // Make selectable
        el.addEventListener('click', (e) => {
            // Self
            if(e.target.hasAttribute('orcos-linked'))
                this.emit('nodeselect', e.target)
            // Parent
            else if(e.target.parentElement?.hasAttribute('orcos-linked'))
                this.emit('nodeselect', e.target.parentElement)
            // Current target
            else
                this.emit('nodeselect', e.currentTarget)
        })
    }

    connectedCallback() {
        // Walk every element children of root
        Utils.every(this, (el) => this.processElement(el))

        let shadow = this.attachShadow({ mode: 'closed' })
        shadow.innerHTML = `
            <slot></slot>
        `
    }
}

customElements.define('orcos-root-component', OrcosRootComponent)