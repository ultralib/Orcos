export const OrcosWindow = class extends HTMLElement {
    constructor() {
        super()
    }

    makeDraggable() {
        // Header draggable
        this.querySelector('.window-header').onmousedown = (e) => {
            let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0

            e.preventDefault()

            // Get mouse cursor
            pos3 = e.clientX
            pos4 = e.clientY

            // Stop moving when mouse button was released
            document.onmouseup = (e) => {
                document.onmouseup = null
                document.onmousemove = null
            }

            // Do drag window
            document.onmousemove = (e) => {
                e.preventDefault()
                // Calculate new pos
                pos1 = pos3 - e.clientX
                pos2 = pos4 - e.clientY
                pos3 = e.clientX
                pos4 = e.clientY
                // Set new position
                this.style.top = (this.offsetTop - pos2) + 'px'
                this.style.left = (this.offsetLeft - pos1) + 'px'
            }
        }
    }

    hide() {
        this.setAttribute('visible', 'false')
        this.setAttribute('aria-hidden', 'true')
    }
    show() {
        this.setAttribute('visible', 'true')
        this.setAttribute('aria-hidden', 'false')
    }

    connectedCallback() {
        let closeable = this.getAttribute('closeable') === 'false' ? false : true
        let slot = this.innerHTML

        this.innerHTML = `
            <div class="window-header">
                <p class="window-title">${ this.getAttribute('title') || 'Window' }</p>
                ${ closeable ? '<svg class="window-close" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>' : '' }
            </div>
            <div class="window-body">
                ${ slot }
            </div>
        `

        this.removeAttribute('title')
        
        // Draggable header
        this.makeDraggable()

        // Closeable
        if(closeable) {
            this.querySelector('.window-close').onclick = (e) => {
                this.hide()
            }
        }
    }
}

customElements.define('orcos-window', OrcosWindow)