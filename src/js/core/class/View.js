export default class View {
	_matcher = null
	_view = null
	_init = null

	constructor(matcher, init, view) {
		if(typeof matcher !== 'function') throw new Error('View matcher was not function')
		if(typeof view !== 'string') throw new Error('View content was not string')
		if(typeof init !== 'function') throw new Error('View init was not function')

		this._matcher = matcher
		this._view = view
		this._init = init

		// Add to views
		window.$views = window.$views ?? []
		window.$views.push(this)
	}

	static run() {
		const params = new URLSearchParams(window.location.search)
		for(let view of window.$views) {
			if(view._matcher(params)) {
				document.body.innerHTML = view._view
				view._init()
				break
			}
		}
	}
}