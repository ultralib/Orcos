import StorageController from '../core/StorageController'

export default new class ComponentController {
	//#region Kits
	listKits() {
		return JSON.parse(StorageController.get('_orcos_kits') ?? '[]')
	}
	createKit(name) {
		StorageController.set('_orcos_kit_' + name.toLowerCase(), JSON.stringify({
			name: name
		}))
	}
	//#endregion

	//#region Components
	listComponents(kitName) {
		return JSON.parse(
			StorageController.get('_orcos_kit_' + kitName) ?? '{}'
		)
	}
	getComponent(componentName) {
		return JSON.parse(
			StorageController.get('_orcos_component_' + componentName) ?? '{}'
		)
	}
	createComponent(name) {
		StorageController.set(

		)
	}
	//#endregion
}