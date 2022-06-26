import '../css/theme.scss'
import '../css/core.scss'

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

// Core
const Project = new class {
    get templates() {
        return {
            basic: {
                baseStyle: `
                    width: 100%;
                    max-width: 250px;
                    padding: 15px 20px;
                    display:flex;
                    flex-direction:column;
                    border-radius:15px;
                    background-color:white;
                    font-family:'Inter','Roboto',sans-serif;
                `,
                inner: `
                    <style component-style scoped>:host *,:host *::before,:host *::after{
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                        font-family: inherit;   
                    }</style>
                    <h1 style="margin-bottom:5px">Header</h1>
                    <p>Some text</p>
                `
            }
        }
    }
    get elements() {
        const element = (tag, text, attrs) => {
            let _el = document.createElement(tag)
            // Text
            if(text) _el.innerText = text
            if(attrs) {
                Object.keys(attrs).forEach(attrName => {
                    _el.setAttribute(attrName, attrs[attrName])
                })
            }
            return _el
        }

        return {
            text: element('p', 'Text'),
            link: element('a', 'Link', { href: '#' }),
            image: element('img', null, { src: '' })
        }
    }

    constructor() {
        // Make root element
        this.rootElement = document.createElement('orcos-root-component')
        this.rootElement.setAttribute('arcos-name', 'root')
        this.rootElement.useTemplate(this.templates['basic'])
        this.rootElement.addEventListener('nodeselect', (e) => {
            // Focus
            //e.detail.element.focus()
            // Select node in tree
            e.detail.linked.select()
            // Attach to property editor
            this.propsElement.attachElement(e.detail.element)
        })
        this.rootElement.addEventListener('nodeedit', (e) => {
            // Rename node in tree
            e.detail.linked.rename(e.detail.element.innerText)
        })
        document.querySelector('main').appendChild(this.rootElement)

        // Tree component
        this.treeElement = document.querySelector('orcos-tree')
        this.treeElement.from(this.rootElement)
        this.treeElement.addEventListener('nodeadd', (e) => {
            this.addWindow.show()

            const listener = (clickE) => {
                // Make element
                let newElement = this.elements[clickE.currentTarget.getAttribute('data-template')]
                
                // Append to root
                this.rootElement.processElement(newElement)
                e.detail.linked.appendChild(newElement)

                // Append to tree
                e.detail.node.querySelector('.nodes')?.appendChild(this.treeElement.makeNode(newElement))
            }

            // Templates of elements
            this.addWindow.querySelectorAll('[data-template]').forEach(templateEl => {
                templateEl.removeEventListener('click', listener)
                templateEl.addEventListener('click', listener)
            })
        })
        this.treeElement.addEventListener('nodedelete', (e) => {
            // Remove linked
            e.detail.linked.remove()
        })
        this.treeElement.addEventListener('nodeselect', (e) => {
            // Unselect previous
            this.rootElement.unselect()
            // Make selected
            e.detail.linked.setAttribute('selected', '')
            // Focus
            //e.detail.linked.focus()
            // Attach to property editor
            this.propsElement.attachElement(e.detail.linked)
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