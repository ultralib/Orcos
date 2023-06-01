import '../css/theme.scss'
import '../css/core.scss'
import '../css/components/shared/button.scss'
import '../css/components/shared/input.scss'
import '../css/components/shared/list.scss'

// Polyfills
//import '@webcomponents/webcomponentsjs/webcomponents-bundle'

// Zooming
//import createPanZoom from 'panzoom'
//createPanZoom(document.querySelector('main'))

// Components
import './components/shared/OrcosWindow.js'

// Components: Editor
import './components/editor/OrcosRootComponent.js'
import './components/editor/OrcosTreeView.js'
import './components/editor/OrcosTreeNode.js'
import './components/editor/OrcosProperties.js'
import './components/editor/OrcosCodeEditor.js'
import './components/editor/OrcosSandbox.js'
import './components/editor/OrcosLog.js'

// Components: Input
import './components/input/OrcosUnitsInput.js'
import './components/input/OrcosSpacingInput.js'

// Views
import View from './core/class/View.js'
import './views/ListView.js'
import './views/EditorView.js'

// Views
document.addEventListener('DOMContentLoaded', View.run)