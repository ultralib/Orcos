import View from '../core/class/View'

new View(
	(params) => params.get('edit') === null,
	() => void 0,
	/*html*/`
		<section>
			<div class="container">
				<h1>Components</h1>

				<div class="orcos-list">
					<div data-template="text" class="orcos-list-item orcos-list-item-md orcos-list-item-solid with-icon">
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 7 4 4 20 4 20 7"></polyline><line x1="9" y1="20" x2="15" y2="20"></line><line x1="12" y1="4" x2="12" y2="20"></line></svg>
						<p>Text</p>
					</div>
					<div data-template="link" class="orcos-list-item orcos-list-item-md orcos-list-item-solid with-icon">
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
						<p>Link</p>
					</div>
				</div>
			</div>
		</section>
	`
)