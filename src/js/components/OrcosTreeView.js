import Utils from "./Utils"

export const OrcosTreeView = class extends HTMLElement {
    constructor() {
        super()
    }

    unselect() {
        this.querySelector('[selected]')?.removeAttribute('selected')
    }

    makeNode(el, deletable = true, renameable = true) {
        // Pass non-visual tags
        if(Utils.nonvisualTags.includes(el.tagName))
            return

        let nodeEl = document.createElement('orcos-node')

        // From ID
        let name = (el.hasAttribute('id') ? '#' + el.getAttribute('id') : null)
            // From name
            ?? el.getAttribute('orcos-name')
            // From text/tag
            ?? (Utils.textualTags.includes(el.tagName) ? el.innerText : el.tagName)

        // Text element
        if(Utils.textualTags.includes(el.tagName)) {
            nodeEl.setAttribute('is-parent', 'false')
            nodeEl.setAttribute('is-addable', 'false')
            nodeEl.setAttribute('text', name)
        }
        // Block element
        else {
            if(Utils.parentTags.includes(el.tagName) || el.tagName === 'ORCOS-ROOT-COMPONENT') {
                nodeEl.setAttribute('is-parent', 'true')
                nodeEl.setAttribute('is-addable', 'true')
            }
            nodeEl.setAttribute('text', name)
        }

        // Icon
        switch(el.tagName) {
            case 'P':
            case 'H1':
            case 'H2':
            case 'H3':
            case 'H4':
            case 'H5':
            case 'H6':
                nodeEl.setAttribute('icon', 'text')
                break
            case 'A':
                nodeEl.setAttribute('icon', 'link')
                break
            case 'UL':
                nodeEl.setAttribute('icon', 'list')
                break
            case 'IMG':
                nodeEl.setAttribute('icon', 'image')
                break
            case 'BUTTON':
                nodeEl.setAttribute('icon', 'button')
                break
            case 'DIV':
                if(el.style.display === 'grid')
                    nodeEl.setAttribute('icon', 'grid')
                else
                    nodeEl.setAttribute('icon', 'panel')
                break
            case 'INPUT':
                let inputType = el.getAttribute('type') || ''
                if(inputType === 'checkbox')
                    nodeEl.setAttribute('icon', 'checkbox')
                else
                    nodeEl.setAttribute('icon', 'input')
                break
        }

        // Link
        let link = Utils.generateRandom(8)
        nodeEl.setAttribute('orcos-link', link)
        el.setAttribute('orcos-linked', link)

        // Deletable, Renameable
        nodeEl.setAttribute('is-deletable', deletable)
        nodeEl.setAttribute('is-renameable', renameable)

        // Childs (Non-textual element)
        if(!Utils.textualTags.includes(el.tagName)) {
            for(let child of el.children) {
                let childNode = this.makeNode(child)
                if(childNode)
                    nodeEl.appendChild(childNode)
            }
        }

        return nodeEl
    }

    from(rootElement) {
        // Clear previous tree
        this.innerHTML = ''
        // Make new tree from root element
        this.appendChild(this.makeNode(rootElement, false, false))
    }

    connectedCallback() {
        let slot = this.innerHTML

        this.innerHTML = `
            ${ slot }
        `
    }
}

customElements.define('orcos-tree', OrcosTreeView)