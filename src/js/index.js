import '../css/theme.scss'
import '../css/core.scss'
import '../css/components/button.scss'
import '../css/components/input.scss'
import '../css/components/list.scss'

// Polyfills
import '@webcomponents/webcomponentsjs/webcomponents-bundle'

// Zooming
//import createPanZoom from 'panzoom'
//createPanZoom(document.querySelector('main'))

// Components
import './components/OrcosRootComponent.js'
import './components/OrcosTreeView.js'
import './components/OrcosTreeNode.js'
import './components/OrcosProperties.js'
import './components/OrcosWindow.js'
import './components/OrcosUnitsInput.js'

// Other
import Templates from '../js/components/Templates.js'
import Utils from '../js/components/Utils.js'

// Core
window.Project = new class {
    getPairElements(pairObj) {
        let _link = pairObj.link || (document.querySelector(`[orcos-link="${pairObj.linked.getAttribute('orcos-linked')}"]`))
        let _linked = pairObj.linked || (document.querySelector(`[orcos-linked="${pairObj.link.getAttribute('orcos-link')}"]`))

        return { link: _link, linked: _linked }
    }

    selectElement(pair) {
        let { link, linked } = this.getPairElements(pair)

        // Unselect previous
        this.treeElement.unselect()
        this.rootElement.unselect()

        // Make selected
        link.setAttribute('selected', '')
        linked.setAttribute('selected', '')

        // Focus
        //linked.focus()

        // Attach to property editor
        this.propsElement.attachElement(linked)
    }

    moveElement(direction, pair) {
        let { link, linked } = this.getPairElements(pair)

        if(link && linked) {
            let moveDown = (el) => {
                if(el.nextElementSibling) el.parentNode.insertBefore(el.nextElementSibling, el)
            }
            let moveUp = (el) => {
                if(el.previousElementSibling) el.parentNode.insertBefore(el, el.previousElementSibling)
            }

            // Down
            if(direction === 'down') {
                moveDown(linked)
                moveDown(link)
            }
            // Up
            else if(direction === 'up') {
                moveUp(linked)
                moveUp(link)
            }
        }
        else
            console.error('Link or linked element was not found')
    }

    deleteElement(pair) {
        let { link, linked } = this.getPairElements(pair)

        link.remove()
        linked.remove()
    }

    appendElement(linkId, newElement) {

    }

    constructor() {
        // Make root element
        this.rootElement = document.createElement('orcos-root-component')
        this.rootElement.setAttribute('orcos-name', 'root')
        this.rootElement.useTemplate(Templates.components['basic'])
        this.rootElement.addEventListener('nodeselect', (e) => {
            this.selectElement({ linked: e.detail.element })
        })
        this.rootElement.addEventListener('nodeedit', (e) => {
            let { link, linked } = this.getPairElements({ linked: e.detail.element })

            // Rename node in tree
            link.rename(e.detail.element.innerText)
        })
        document.querySelector('main').appendChild(this.rootElement)

        // Tree component
        this.treeElement = document.querySelector('orcos-tree')
        this.treeElement.from(this.rootElement)
        this.treeElement.addEventListener('nodeadd', (e) => {
            let { link, linked } = this.getPairElements({ link: e.detail.node })

            this.addWindow.show()

            const listener = (clickE) => {
                // Make element
                let newElement = Templates.elements[clickE.currentTarget.getAttribute('data-template')]
                
                // Append to root
                this.rootElement.processElement(newElement)
                linked.appendChild(newElement)

                // Append to tree
                link.querySelector('.nodes')?.appendChild(this.treeElement.makeNode(newElement))
            }

            // Templates of elements
            this.addWindow.querySelectorAll('[data-template]').forEach(templateEl => {
                templateEl.onclick = listener
            })
        })
        this.treeElement.addEventListener('nodedelete', (e) => {
            this.deleteElement({ link: e.detail.node })
        })
        this.treeElement.addEventListener('nodeselect', (e) => {
            this.selectElement({ link: e.detail.node })
        })

        // Unselect elements when clicked on canvas
        document.querySelector('main').addEventListener('click', (e) => {
            if(e.target.tagName === 'MAIN') {
                this.rootElement.unselect()
                this.treeElement.unselect()
                this.propsElement.attachElement(null)
            }
        })

        // PropertyEditor component
        this.propsElement = document.querySelector('orcos-properties')

        // Add element window
        this.addWindow = document.querySelector('orcos-window#add-window')
    }
}