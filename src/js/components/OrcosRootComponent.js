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
                element: element
            }
        })
        // Dispatch to tree
        this.dispatchEvent(event)
    }

    useTemplate(template) {
        this.setAttribute('style', template.baseStyle || '')
        this.innerHTML = template.inner || ''
    }

    serialize() {
        let copyEl = this.cloneNode(true)

        for(let el of copyEl.querySelectorAll('[contenteditable], [orcos-linked], [disabled]')) {
            el.removeAttribute('contenteditable')
            el.removeAttribute('orcos-linked')
            el.removeAttribute('disabled')
        }

        return copyEl
    }

    processElement(el) {
        // If its text => make text editable
        if(Utils.editableTags.includes(el.tagName)) {
            el.setAttribute('contenteditable', '')
            if(Utils.textualTags.includes(el.tagName)) {
                el.addEventListener('input', (e) => {
                    this.emit('nodeedit', e.target)
                })
            }
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

        // Hotkeys
        document.addEventListener('keyup', (e) => {
            let selectedEl = this.querySelector('[selected]')

            // Selected not found || Selected is root
            if(!selectedEl || selectedEl.tagName === 'ORCOS-ROOT-COMPONENT')
                return

            // Move element down (Opt/Alt + Down)
            if (e.altKey && e.key === 'ArrowDown') {
                window.Project.moveElement('down', { linked: selectedEl })
            }
            // Move element up (Opt/Alt + Up)
            else if (e.altKey && e.key === 'ArrowUp') {
                window.Project.moveElement('up', { linked: selectedEl })
            }
            // Delete element (Opt/Alt + Delete)
            else if (e.altKey && e.key === 'Delete') {
                window.Project.deleteElement({ linked: selectedEl })
            }
        }, false);
    }
}

customElements.define('orcos-root-component', OrcosRootComponent)