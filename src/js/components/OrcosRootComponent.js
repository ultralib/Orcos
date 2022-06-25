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

    connectedCallback() {
        // Walk every element children of root
        Utils.every(this, (el) => {
            // If its text => make text editable
            if(Utils.textualTags.includes(el.tagName)) {
                el.setAttribute('contenteditable', '')
                el.addEventListener('input', (e) => {
                    this.emit('nodeedit', e.target)
                })
            }

            // Make selectable
            el.addEventListener('click', (e) => {
                this.emit('nodeselect', e.target)
            })
        })

        let shadow = this.attachShadow({ mode: 'closed' })
        shadow.innerHTML = `
            <slot></slot>
        `
    }
}

customElements.define('orcos-root-component', OrcosRootComponent)