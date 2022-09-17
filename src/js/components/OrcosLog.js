export const OrcosLog = class extends HTMLElement {
    constructor() {
        super()
    }

    write(severity, args) {
        this.innerHTML += `
            <div class="log-message" data-severity="${severity}">
                ${args.map(arg => 
                    `<span>${JSON.stringify(arg)}</span>`
                ).join('')}
            </div>
        `
    }
    clear() {
        this.innerHTML = ''
    }
}

customElements.define('orcos-log', OrcosLog)