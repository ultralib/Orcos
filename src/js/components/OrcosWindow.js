export const OrcosWindow = class extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        let slot = this.innerHTML

        this.innerHTML = `
            <div class="window-header">

            </div>
            <div class="window-body">
                ${ slot }
            </div>
        `
    }
}

customElements.define('orcos-window', OrcosWindow)