export default new class StorageController {
	get(key) {
		return localStorage.getItem(key)
	}
    set(key, val) {
		localStorage.setItem(key, val.toString())
	}
	delete(key) {
		localStorage.removeItem(key)
	}
}