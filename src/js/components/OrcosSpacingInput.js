export const OrcosSpacingInput = class extends HTMLElement {
    constructor() {
        super()
    }

    getValue() {
        return this.value
    }

    get value() {
        if(this.topInput && this.bottomInput && this.leftInput && this.rightInput) {
            return `${this.topInput.value || 0}px ${this.rightInput.value || 0}px ${this.bottomInput.value || 0}px ${this.leftInput.value || 0}px`
        }
        else
            return null
    }
    set value(val) {
        if(val && val.length > 0) {
			let values = val.split(' ')

			// Top, Right, Bottom, Left
			if(values.length === 4) {
				let [ top, right, bottom, left ] = values
				this.topInput.value = top.match(/[\d\.]+|\D+/g)[0] ?? ''
				this.rightInput.value = right.match(/[\d\.]+|\D+/g)[0] ?? ''
				this.bottomInput.value = bottom.match(/[\d\.]+|\D+/g)[0] ?? ''
				this.leftInput.value = left.match(/[\d\.]+|\D+/g)[0] ?? ''
			}
			// Top, Horizontal, Bottom
			else if(values.length === 3) {
				let [ top, horizontal, bottom ] = values
				horizontal = horizontal.match(/[\d\.]+|\D+/g)[0] ?? ''

				this.topInput.value = top.match(/[\d\.]+|\D+/g)[0] ?? ''
				this.rightInput.value = horizontal
				this.bottomInput.value = bottom.match(/[\d\.]+|\D+/g)[0] ?? ''
				this.leftInput.value = horizontal
			}
			// Vertical, Horizontal
			else if(values.length === 2) {
				let [ vertical, horizontal ] = values
				vertical = vertical.match(/[\d\.]+|\D+/g)[0] ?? ''
				horizontal = horizontal.match(/[\d\.]+|\D+/g)[0] ?? ''

				this.topInput.value = vertical
				this.rightInput.value = horizontal
				this.bottomInput.value = vertical
				this.leftInput.value = horizontal
			}
			// All
			else if(values.length === 1) {
				let [ all ] = values
				all = all.match(/[\d\.]+|\D+/g)[0] ?? ''

				this.topInput.value = all
				this.rightInput.value = all
				this.bottomInput.value = all
				this.leftInput.value = all
			}
        }
    }

    connectedCallback() {
        this.innerHTML = `
            <input class="orcos-input" name="top" type="number" min="0" placeholder="0">
            <input class="orcos-input" name="bottom" type="number" min="0" placeholder="0">
            <input class="orcos-input" name="left" type="number" min="0" placeholder="0">
            <input class="orcos-input" name="right" type="number" min="0" placeholder="0">
        `

		this.topInput = this.querySelector('[name="top"]')
		this.bottomInput = this.querySelector('[name="bottom"]')
		this.leftInput = this.querySelector('[name="left"]')
		this.rightInput = this.querySelector('[name="right"]')
    }
}

customElements.define('orcos-spacing-input', OrcosSpacingInput)