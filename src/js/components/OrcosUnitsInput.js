export const OrcosUnitsInput = class extends HTMLElement {
    constructor() {
        super()
    }

    getValue() {
        return this.value
    }

    get value() {
        if(this.numberInput.value && this.unitInput.value) {
            return this.numberInput.value + this.unitInput.value
        }
        else
            return null
    }
    set value(val) {
        if(val && val.length > 0) {
            let [ number, unit ] = val.match(/[\d\.]+|\D+/g)
            this.numberInput.value = number
            this.unitInput.value = unit
        }
    }

    connectedCallback() {
        this.innerHTML = `
            <input class="orcos-input" type="number" min="0" placeholder="${this.getAttribute('placeholder') || 'Enter value'}">
            <select class="orcos-input">
                <option value="">-</option>
                <option value="px">px</option>
                <option value="%">%</option>
                <option value="rem">rem</option>
                <option value="em">em</option>
                <option value="pt">pt</option>
                <option value="vw">vw (Screen Width)</option>
                <option value="vh">vh (Screen Height)</option>
            </select>
        `

        let onChange = (e) => {
            //this.dispatchEvent(new Event('input', { bubbles: true }))
        }

        this.numberInput = this.querySelector('input')
        //this.numberInput.addEventListener('input', onChange)
        this.unitInput = this.querySelector('select')
        //this.unitInput.addEventListener('input', onChange)
    }
}

customElements.define('orcos-units-input', OrcosUnitsInput)