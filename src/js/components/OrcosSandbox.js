import CoreJS from '!raw-loader!../lib/Core.js'
import CatchJS from '!raw-loader!../lib/Catch.js'
import ClearCSS from '!raw-loader!../lib/Clear.css'
import CoreCSS from '!raw-loader!../lib/Core.css'

export const OrcosSandbox = class extends HTMLElement {
    constructor() {
        super()
    }

    hide() {
        this.setAttribute('visible', 'false')
        this.setAttribute('aria-hidden', 'true')

        // Stop sandboxing
        this.stop()
    }
    show() {
        this.setAttribute('visible', 'true')
        this.setAttribute('aria-hidden', 'false')
    }

    onMessage(e) {
        const data = e.data
        if(!data.type) { return }

        switch(data.type) {
            case 'log': {
                this.log.write(data.severity ?? 'info', data.args)
            }            
        }

        //console.log('RECEIVED', data)
    }
    run({ name, root, js }) {
        let inner = root.innerHTML
        let style = root.getAttribute('style')

        // Show sandbox
        this.show()

        // Make frame for sandboxing
        let frame = document.createElement('iframe')
        frame.setAttribute('sandbox', 'allow-scripts allow-popups allow-modals')
        frame.setAttribute('seamless', '')
        frame.setAttribute('srcdoc', `
            <!-- Styles -->
            <style>${ClearCSS}</style>
            <style>${CoreCSS}</style>

            <!-- Component -->
            <orcos-com style="${style}">
                ${inner}
            </orcos-com>

            <!-- Logic -->
            <script>${CoreJS}</script>
            <script>${CatchJS}</script>
            <script>${js}</script>
        `)

        // Handle sandbox messages
        window.onmessage = (e) => this.onMessage(e)

        // Add sandbox frame
        this.componentWindow.querySelector('.window-body').appendChild(frame)
    }

    stop() {
        // Remove <iframe>
        this.componentWindow.querySelector('iframe').remove()

        // Remove message listener
        window.onmessage = null

        // Clear log
        this.log.clear()
    }

    connectedCallback() {
        this.innerHTML = `
            <div class="sandbox-header">
                <p class="sandbox-title">Orcos: Sandbox</p>
                <svg class="sandbox-close" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </div>
            <div class="sandbox-container">
                <orcos-window id="sandbox-component-window" visible="true" closeable="false" title="Component">
                
                </orcos-window>
                <orcos-window id="sandbox-log-window" visible="true" title="Log">
                    <orcos-log></orcos-log>
                </orcos-window>
            </div>
        `

        this.componentWindow = this.querySelector('#sandbox-component-window')
        this.log = this.querySelector('orcos-log')

        // Closeable
        this.querySelector('.sandbox-close').onclick = (e) => {
            this.hide()
        }
    }
}

customElements.define('orcos-sandbox', OrcosSandbox)