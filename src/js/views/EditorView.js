import View from '../core/class/View'
import Templates from '../core/Templates.js'

// Core
class Project {
    getPairElements(pairObj) {
        let _link = pairObj.link || (document.querySelector(`[orcos-link="${pairObj.linked.getAttribute('orcos-linked')}"]`))
        let _linked = pairObj.linked || (document.querySelector(`[orcos-linked="${pairObj.link.getAttribute('orcos-link')}"]`))

        return { link: _link, linked: _linked }
    }

    selectElement(pair) {
        let { link, linked } = this.getPairElements(pair)

        if(link && linked) {
            // Unselect previous
            this.treeElement.unselect()
            this.rootElement.unselect()

            // Make selected
            link.setAttribute('selected', '')
            linked.setAttribute('selected', '')

            // Focus
            //linked.focus()

            // Attach to property editor
            this.propsElement.attachElement({ link, linked })
        }
        else
            console.error('Link or linked element was not found', pair)
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
            console.error('Link or linked element was not found', pair)
    }

    deleteElement(pair) {
        let { link, linked } = this.getPairElements(pair)

        //TODO: check that is not root
        
        link.remove()
        linked.remove()
    }

    duplicateElement(pair) {
        let toDuplicatePair = this.getPairElements(pair)
        let parentPair = this.getPairElements({ linked: toDuplicatePair.linked.parentNode})
        
        //TODO: check that is not root

        console.log(toDuplicatePair, parentPair)
    }

    appendElement(parentPair, newElement) {
        // Process element
        this.rootElement.processElement(newElement)

        // Append to parent in root
        parentPair.linked.appendChild(newElement)

        // Append to parent in tree
        parentPair.link.querySelector('.nodes')?.appendChild(this.treeElement.makeNode(newElement))
    }

    constructor(template = Templates.components.basic) {
        // Make root element
        this.rootElement = document.createElement('orcos-root-component')
        this.rootElement.setAttribute('orcos-name', 'Component')
        this.rootElement.useTemplate(template)
        this.rootElement.addEventListener('nodeselect', (e) => {
            this.selectElement({ linked: e.detail.element })
        })
        this.rootElement.addEventListener('nodeedit', (e) => {
            let { link, linked } = this.getPairElements({ linked: e.detail.element })

            // Rename node in tree
            link.rename(e.detail.element.innerText)
        })
        document.querySelector('main').appendChild(this.rootElement)

        // Make DOM tree element
        this.treeElement = document.querySelector('orcos-tree')
        this.treeElement.from(this.rootElement)
        this.treeElement.addEventListener('nodeadd', (e) => {
            let parentPair = this.getPairElements({ link: e.detail.node })

            this.addWindow.show()

            const onAddlistener = (clickE) => {
                // Make element
                let newElement = Templates.elements[clickE.currentTarget.getAttribute('data-template')].cloneNode(true)

                console.log('[index]', 'Adding element')
                
                // Append to root & tree
                this.appendElement(parentPair, newElement)

                console.log('[index]', 'Added element')
            }

            // Templates of elements
            this.addWindow.querySelectorAll('[data-template]').forEach(templateEl => {
                templateEl.onclick = onAddlistener
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

        // CodeEditor
        this.editorElement = document.querySelector('orcos-code-editor')
        this.editorElement.code = template.baseLogic

        // Add element window
        this.addWindow = document.querySelector('orcos-window#add-window')

        // Add sandbox
        this.sandboxWindow = document.querySelector('orcos-sandbox')

        // Add functionality to nav buttons
        document.querySelector('#run-button').onclick = (() => {
            let root = this.rootElement.serialize()
            this.sandboxWindow.run({
                name: 'test',
                root: root,
                js: this.editorElement.code
            })
        })
        document.querySelector('#plugins-button').onclick = (
            () => console.error('Not supported yet')
        )
        document.querySelector('#export-button').onclick = (() => {
            console.error('Not supported yet')
        })
    }
}

new View(
	(params) => params.get('edit') !== null,
	() => window.Project = new Project(),
	/*html*/`
		<!-- Navigation -->
		<nav>
			<p class="logo">Orcos</p>

			<div class="items items-right">
				<div class="item" id="run-button" title="Run">
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-play"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
				</div>
				<div class="item" id="plugins-button" title="Plugins">
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-sliders"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>
				</div>
				<div class="item" id="export-button" title="Export project">
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-download"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
				</div>
			</div>
		</nav>

		<!-- IDE -->
		<div id="app">
			<aside class="side-left">
				<p class="title">Elements</p>
				<orcos-tree></orcos-tree>
			</aside>

			<main>
				<aside class="side-bottom">
					<orcos-code-editor></orcos-code-editor>
				</aside>
			</main>

			<aside class="side-right">
				<p class="title">Properties</p>
				<orcos-properties></orcos-properties>
			</aside>
		</div>

		<!-- Window: Add element -->
		<orcos-window id="add-window" visible="false" title="Add element">
			<div class="orcos-list">
				<div data-template="text" class="orcos-list-item with-icon">
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 7 4 4 20 4 20 7"></polyline><line x1="9" y1="20" x2="15" y2="20"></line><line x1="12" y1="4" x2="12" y2="20"></line></svg>
					<p>Text</p>
				</div>
				<div data-template="link" class="orcos-list-item with-icon">
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
					<p>Link</p>
				</div>
				<div data-template="image" class="orcos-list-item with-icon">
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
					<p>Image</p>
				</div>
				<div data-template="list" class="orcos-list-item with-icon">
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
					<p>List</p>
				</div>
				<div data-template="panel" class="orcos-list-item with-icon">
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-menu"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
					<p>Panel</p>
				</div>
				<div data-template="grid" class="orcos-list-item with-icon">
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
					<p>Grid</p>
				</div>
				<div data-template="button" class="orcos-list-item with-icon">
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>
					<p>Button</p>
				</div>
				<div data-template="input" class="orcos-list-item with-icon">
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>
					<p>Input</p>
				</div>
				<div data-template="checkbox" class="orcos-list-item with-icon">
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
					<p>Checkbox</p>
				</div>
			</div>
		</orcos-window>

		<!-- Sandbox -->
		<orcos-sandbox id="sandbox" visible="false"></orcos-sandbox>
	`
)