import Utils from "./Utils"


export const OrcosTreeNode = class extends HTMLElement {
    constructor() {
        super()
    }

    select() {
        // Unselect previous
        this.tree.unselect()
        // Select
        this.handle.setAttribute('selected', '')
        // Emit event
        this.emit('nodeselect')
    }

    rename(text) {
        this.setAttribute('text', text)
        this.__render__()
    }

    emit(eventName) {
        // Make event
        let event = new CustomEvent(eventName, {
            detail: {
                node: this,
                linked: document.querySelector(`[orcos-linked="${this.getAttribute('orcos-link')}"]`)
            }
        })
        // Dispatch to tree
        this.closest('orcos-tree')?.dispatchEvent(event)
    }

    connectedCallback() {
        this.tree = this.closest('orcos-tree')
        this.slot = this.innerHTML

        this.__render__()
    }

    __render__() {
        this.innerHTML = `
            <span class="node-handle">
                <svg class="close-icon" role="toggle" title="Toggle child elements" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                <span class="node-title">${ this.getAttribute('text') }</span>
                ${ this.getAttribute('is-addable') === 'true' ? '<svg class="add-icon" title="Add element inside" role="add" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>' : ''}
                ${ this.getAttribute('is-deletable') === 'true' ? '<svg class="delete-icon" title="Delete element" role="delete" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>' : ''}
            </span>
            <div class="nodes">
                ${ this.slot }
            </div>
        `

        this.handle = this.querySelector('.node-handle')

        // Toggle childs
        this.handle.querySelectorAll('svg').forEach(iconEl => {
            iconEl.onclick = (e) => {
                let role = e.currentTarget.getAttribute('role')
                if(role === 'toggle') {
                    this.emit('nodetoggle')
                    // Toggle childs visibility
                    this.handle.classList.toggle('visible')
                }
                else if(role === 'add') {
                    this.emit('nodeadd')
                }
                else if(role === 'delete') {
                    this.emit('nodedelete')
                    // Remove node
                    this.remove()
                }
            }
        })
        // Select
        this.handle.onclick = (e) => {
            //e.stopPropagation()
            if(e.currentTarget.classList.contains('node-handle')) {
                this.select()
            }
        }
    }
}

customElements.define('orcos-node', OrcosTreeNode)