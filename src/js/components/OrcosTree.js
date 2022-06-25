export const OrcosTree = class extends HTMLElement {
    constructor() {
        super()
        //this.shadowRoot = this.attachShadow({ mode: 'closed' })
    }

    connectedCallback() {
        this.shadow = this.attachShadow({ mode: 'closed' })
        this.shadow.innerHTML = `
            <slot />
        `
    }
}
export const OrcosNode = class extends HTMLElement {
    constructor() {
        super()
        //this.shadowRoot = this.attachShadow({ mode: 'closed '})
    }

    connectedCallback() {
        this.shadow = this.attachShadow({ mode: 'closed' })
        this.shadow.innerHTML = `  
            <span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-down"><polyline points="6 9 12 15 18 9"></polyline></svg>
                ${ this.getAttribute('text') }
            </span>
            <div class="nodes">
                <slot />
            </div>
        `
    }
}
customElements.define('orcos-tree', OrcosTree)
customElements.define('orcos-node', OrcosNode)