import Utils from "./Utils"

export const OrcosProperties = class extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        this.__render__()
    }

    attachElement(el) {
        this.attachedEl = el
        this.__render__()
    }

    __categoryToElement__(categoryName, category) {
        let propsHtml = ''

        Object.keys(category.fields).forEach(fieldName => {
            propsHtml += this.__fieldToElement__(categoryName, fieldName, category.fields[fieldName])
        })

        return `
            <div class="category visible">
                <p class="category-title">
                    <span>${category.title}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </p>
                <div class="category-fields">
                    ${propsHtml}
                </div>
            </div>
        `
    }

    __fieldToElement__(category, field, prop) {
        let inputEl = ''

        let makeInput = (type, placeholder, { min, max }) => `
            <input
                name="${field}"
                category="${category}"
                class="property-field orcos-input"
                type="${type}"
                ${placeholder ? `placeholder="${placeholder}"` : ''}
                ${min ? `min="${min}"` : ''}
                ${max ? `max="${max}"` : ''}
            >
        `
        let makeSelect = (placeholder, options) => `
            <select name="${field}" category="${category}" placeholder="${placeholder || 'Choose'}" class="property-field orcos-input">
                ${placeholder ? `<option disabled>${placeholder}</option>` : ''}
                <option selected value="">-</option>
                ${options ? 
                    options.map(option => 
                        `<option value="${option?.value || option}">${option?.title || option}</option>`
                    ).join('')
                    : ''}
            </select>
        `
        let makeButtons = (options) => `
            <div name="${field}" category="${category}" class="property-field buttons">
                ${options ? 
                    options.map(option => 
                        `<button value="${option?.value || option}" class="orcos-button">${option?.title || option}</button>`
                    ).join('')
                    : ''}
            </div>
        `
        let makeCustomInput = (tag, placeholder) => `
            <${tag}
                name="${field}"
                category="${category}"
                class="property-field"
                placeholder="${placeholder || ''}"></${tag}>
        `

        if(prop.type === 'text' || prop.type === 'color' || prop.type === 'number' || prop.type === 'range') {
            inputEl = makeInput(prop.type, prop.placeholder, { ...prop })
        }
        else if(prop.type === 'select') {
            inputEl = makeSelect(prop.placeholder, prop.options)
        }
        else if(prop.type === 'units') {
            inputEl = makeCustomInput('orcos-units-input', prop.placeholder)
        }
        // Font
        else if(prop.type === 'font') {
            inputEl = makeSelect(prop.placeholder, this.fontFamilies)
        }
        // Align
        else if(prop.type === 'align') {
            inputEl = makeButtons([
                { value: 'left', title: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="17" y1="10" x2="3" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="17" y1="18" x2="3" y2="18"></line></svg>' },
                { value: 'center', title: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="10" x2="6" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="18" y1="18" x2="6" y2="18"></line></svg>' },
                { value: 'right', title: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="21" y1="10" x2="7" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="21" y1="18" x2="7" y2="18"></line></svg>' }
            ])
        }

        return `
            <div class="property">
                <label for="${field}" class="orcos-label">${prop.title || 'Unknown'}</label>
                ${inputEl}
            </div>
        `
    }

    get fontFamilies() { 
        return Utils.fonts.macOs
    }

    get baseProperties() {
        return {
            size: {
                title: 'Size',
                fields: {
                    width: {
                        title: 'Width',
                        type: 'units',
                        get: (el) => el.style['width'],
                        set: (el, val) => el.style['width'] = val 
                    },
                    maxWidth: {
                        title: 'Maximum Width',
                        type: 'units',
                        get: (el) => el.style['max-width'],
                        set: (el, val) => el.style['max-width'] = val 
                    },
                    height: {
                        title: 'Height',
                        type: 'units',
                        get: (el) => el.style['height'],
                        set: (el, val) => el.style['height'] = val 
                    },
                    maxHeight: {
                        title: 'Maximum Height',
                        type: 'units',
                        get: (el) => el.style['max-height'],
                        set: (el, val) => el.style['max-height'] = val 
                    }
                }
            },
            // TODO: Categories: Background, Content, Border; Props: Border, Alpha, Content Direction & Align
            background: {
                title: 'Background',
                fields: {
                    bgColor: {
                        title: 'Background Color',
                        type: 'color',
                        get: (el) => el.style['background-color'],
                        set: (el, val) => el.style['background-color'] = val
                    },
                }
            },
            // Text
            text: {
                title: 'Text',
                fields: {
                    color: {
                        title: 'Color',
                        type: 'color',
                        get: (el) => el.style['color'],
                        set: (el, val) => el.style['color'] = val 
                    },
                    align: {
                        title: 'Align',
                        type: 'align',
                        get: (el) => el.style['text-align'],
                        set: (el, val) => el.style['text-align'] = val 
                    },
                    font: {
                        title: 'Font',
                        type: 'font',
                        placeholder: 'Choose font',
                        get: (el) => el.style['font-family'],
                        set: (el, val) => el.style['font-family'] = val 
                    },
                    weight: {
                        title: 'Weight',
                        type: 'select',
                        placeholder: 'Choose weight',
                        options: [
                            { value: '100', title: 'Extra Thin' },
                            { value: '200', title: 'Thin' },
                            { value: '300', title: 'Extra Light' },
                            { value: '400', title: 'Light' },
                            { value: '500', title: 'Regular' },
                            { value: '600', title: 'Medium' },
                            { value: '700', title: 'Bold' },
                            { value: '800', title: 'Extra Bold' },
                            { value: '900', title: 'Black' }
                        ],
                        get: (el) => el.style['font-weight'],
                        set: (el, val) => el.style['font-weight'] = val 
                    },
                    style: {
                        title: 'Style',
                        type: 'select',
                        placeholder: 'Choose style',
                        options: [
                            { value: 'normal', title: 'Normal' },
                            { value: 'italic', title: 'Italic' },
                            { value: 'oblique', title: 'Oblique' },
                        ],
                        get: (el) => el.style['font-style'],
                        set: (el, val) => el.style['font-style'] = val 
                    },
                    decoration: {
                        title: 'Decoration',
                        type: 'select',
                        placeholder: 'Choose decoration',
                        options: [
                            { value: 'none', title: 'None' },
                            { value: 'underline', title: 'Underline' },
                            { value: 'overline', title: 'Overline' },
                            { value: 'line-through', title: 'Strikethrough' },
                        ],
                        get: (el) => el.style['text-decoration'],
                        set: (el, val) => el.style['text-decoration'] = val 
                    },
                }
            },
            content: {
                title: 'Content',
                fields: {
                    display: {
                        title: 'Display',
                        type: 'select',
                        placeholder: 'Select display mode',
                        options: [
                            { value: 'none', title: 'None' },
                            { value: 'block', title: 'Block' },
                            { value: 'flex', title: 'Flex (Auto-layout)' },
                            { value: 'inline', title: 'Inline' },
                            { value: 'inline-block', title: 'Inline block' }
                        ],
                        get(el) {
                            return el.style['display']
                        },
                        set(el, val) {
                            el.style['display'] = val
                        }
                    }
                }
            }
        }
    }

    __render__() {
        if(this.attachedEl) {
            this.innerHTML = ''

            // Make props fields
            Object.keys(this.baseProperties).forEach(categoryName => {
                // Convert property object to property field html
                this.innerHTML += this.__categoryToElement__(categoryName, this.baseProperties[categoryName])
            })

            // Categories toggling
            this.querySelectorAll('.category-title').forEach(categoryEl => {
                categoryEl.addEventListener('click', (e) => {
                    categoryEl.parentElement.classList.toggle('visible')
                })
            })
            
            let inputElements = [
                'INPUT', 'SELECT', 'TEXTAREA',
                'ORCOS-UNITS-INPUT'
            ]
            // Apply values & watch changes
            this.querySelectorAll('.property-field').forEach(fieldEl => {
                let fieldObject = this.baseProperties[fieldEl.getAttribute('category')]
                    .fields[fieldEl.getAttribute('name')]
                let currentValue = fieldObject.get(this.attachedEl)

                if(inputElements.includes(fieldEl.tagName)) {
                    // Apply value from attached element
                    fieldEl.value = currentValue

                    // Watch changes & apply to attached element
                    fieldEl.addEventListener('input', (e) => {
                        fieldObject.set(this.attachedEl, e.currentTarget.value)
                    })
                }
                else if(fieldEl.classList.contains('buttons')) {
                    // Apply value from attached element
                    fieldEl.querySelector(`[value="${currentValue}"]`)?.classList.add('selected')

                    // Watch changes & apply to attached element
                    fieldEl.querySelectorAll('button').forEach(optionEl => {
                        optionEl.addEventListener('click', (e) => {
                            e.preventDefault()
                            // Unselect previous
                            e.currentTarget.parentElement.querySelector('.selected')?.classList.remove('selected')
                            // Make selected
                            e.currentTarget.classList.add('selected')
                            // Apply value
                            fieldObject.set(this.attachedEl, e.currentTarget.getAttribute('value'))
                        })
                    })
                }
                else
                    console.error('Unsupported type of input: ' + fieldEl.tagName)
            })
        }
        else
            this.innerHTML = ''
    }
}

customElements.define('orcos-properties', OrcosProperties)