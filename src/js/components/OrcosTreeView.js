import Utils from "./Utils"

export const OrcosTreeView = class extends HTMLElement {
    constructor() {
        super()
    }

    unselect() {
        this.querySelector('[selected]')?.removeAttribute('selected')
    }

    from(rootElement) {
        let makeNode = (el, deletable = true, renameable = true) => {
            // Pass non-visual tags
            if(Utils.nonvisualTags.includes(el.tagName))
                return

            let nodeEl = document.createElement('orcos-node')

            // Text element
            if(Utils.textualTags.includes(el.tagName)) {
                nodeEl.setAttribute('is-addable', 'false')
                nodeEl.setAttribute('text', el.getAttribute('arcos-name') || el.innerText)
            }
            // Block element
            else {
                nodeEl.setAttribute('is-addable', 'true')
                nodeEl.setAttribute('text', el.getAttribute('arcos-name') || el.tagName)
            }
            // Link
            let link = Utils.generateRandom(8)
            nodeEl.setAttribute('orcos-link', link)
            el.setAttribute('orcos-linked', link)

            // Deletable, Renameable
            nodeEl.setAttribute('is-deletable', deletable)
            nodeEl.setAttribute('is-renameable', renameable)

            // Childs
            for(let child of el.children) {
                let childNode = makeNode(child)
                if(childNode)
                    nodeEl.appendChild(childNode)
            }

            return nodeEl
        }
        
        // Clear previous tree
        this.innerHTML = ''
        // Make new tree from root element
        this.appendChild(makeNode(rootElement, false, false))
    }

    connectedCallback() {
        let slot = this.innerHTML

        this.innerHTML = `
            ${ slot }
        `
    }
}

customElements.define('orcos-tree', OrcosTreeView)