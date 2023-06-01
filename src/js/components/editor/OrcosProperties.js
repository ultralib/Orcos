import Utils from "../../core/Utils"

export const OrcosProperties = class extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        this.__render__()
    }

    attachElement(pair) {
        let { link, linked } = pair ?? { link: undefined, linked: undefined }

        this.attachedNode = link
        this.attachedEl = linked
        this.__render__()
    }

    //#region Creating elements (Category, Field)
    __categoryToElement__(categoryName, category) {
        let propsHtml = ''

        Object.keys(category.fields).forEach(fieldName => {
            propsHtml += this.__fieldToElement__(categoryName, fieldName, category.fields[fieldName])
        })

        return `
            <div class="category">
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
                ${placeholder ? `<option disabled selected value="">${placeholder}</option>` : '<option disabled selected value="">Select option</option>' }
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
        else if(prop.type === 'spacing') {
            inputEl = makeCustomInput('orcos-spacing-input', prop.placeholder)
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
    //#endregion

    get fontFamilies() { 
        return Utils.fonts.macOs
    }

    get inputElements() {
        return [
            'INPUT', 'SELECT', 'TEXTAREA',
            'ORCOS-UNITS-INPUT', 'ORCOS-SPACING-INPUT',
            'ORCOS-SELECT-INPUT'
        ]
    }

    get baseProperties() {
        /*
         * Category: {
         *     for: [ 'block' | 'text' | 'text-block' ] | 'any
         * }
         */

        return {
            el: {
                title: 'Element',
                for: 'any',
                fields: {
                    id: {
                        title: 'ID',
                        type: 'text',
                        get: (el) => el.getAttribute('id'),
                        set: (el, val) => {
                            if(this.attachedNode.getAttribute('text').startsWith('#')) {
                                this.attachedNode.rename('#' + val)
                            }

                            el.setAttribute('id', val)
                        }
                    },
                    class: {
                        title: 'Class',
                        type: 'text',
                        get: (el) => el.getAttribute('class'),
                        set: (el, val) => el.setAttribute('class', val)
                    }
                }
            },
            // Size
            size: {
                title: 'Size',
                for: ['block', 'text-block'],
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
                        prop: 'max-width'
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
                        prop: 'max-height'
                    }
                }
            },
            // Spacing, Inner Spacing
            spacing: {
                title: 'Spacing',
                for: 'any',
                fields: {
                    //TODO: inner spacing
                    spacing: {
                        title: 'Spacing',
                        type: 'spacing',
                        prop: 'margin', 
                    },
                    inner_spacing: {
                        title: 'Inner Spacing',
                        type: 'spacing',
                        prop: 'padding', 
                    },
                }
            },
            // TODO: Categories: Background, Content, Border; Props: Border, Alpha, Content Direction & Align
            background: {
                title: 'Background',
                for: ['block', 'text-block'],
                fields: {
                    bgColor: {
                        title: 'Background Color',
                        type: 'color',
                        prop: 'background-color'
                    },
                }
            },
            // Border
            border: {
                title: 'Border',
                for: ['block', 'text-block'],
                fields: {
                    radius: {
                        title: 'Roundness',
                        type: 'units',
                        prop: 'border-radius'
                    },
                    style: {
                        title: 'Style',
                        type: 'select',
                        placeholder: 'Choose style',
                        options: [
                            { value: 'solid', title: 'Solid' },
                        ],
                        prop: 'border-style'
                    },
                    thickness: {
                        title: 'Thickness',
                        type: 'units',
                        prop: 'border-width'
                    },
                    color: {
                        title: 'Border Color',
                        type: 'color',
                        prop: 'border-color'
                    }
                }
            },
            // Text
            text: {
                title: 'Text',
                for: ['text', 'text-block'],
                fields: {
                    color: {
                        title: 'Color',
                        type: 'color',
                        prop: 'color'
                    },
                    size: {
                        title: 'Text size',
                        type: 'units',
                        prop: 'font-size'
                    },
                    align: {
                        title: 'Align',
                        type: 'align',
                        placeholder: 'Choose align',
                        prop: 'text-align',
                    },
                    font: {
                        title: 'Font',
                        type: 'font',
                        placeholder: 'Choose font',
                        prop: 'font-family',
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
                        prop: 'font-weight'
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
                        prop: 'font-style'
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
                        prop: 'text-decoration'
                    },
                }
            },
            // Content
            content: {
                title: 'Content',
                for: ['block'],
                fields: {
                    display: {
                        title: 'Display',
                        type: 'select',
                        placeholder: 'Select display mode',
                        options: [
                            { value: 'none', title: 'None (Hidden)' },
                            { value: 'block', title: 'Block' },
                            { value: 'flex', title: 'Auto-layout (Flex)' },
                            { value: 'inline', title: 'Inline' },
                            { value: 'inline-block', title: 'Inline block' }
                        ],
                        get(el) {
                            return el.style['display']
                        },
                        set(el, val) {
                            el.style['display'] = val
                        }
                    },
                    direction: {
                        title: 'Direction',
                        type: 'select',
                        placeholder: 'Select direction',
                        options: [
                            { value: 'column', title: 'Column' },
                            { value: 'column-reverse', title: 'Column (Reverse)' },
                            { value: 'row', title: 'Row' },
                            { value: 'row-reverse', title: 'Row (Reverse)' },
                        ],
                        prop: 'flex-direction'
                    },
                    justify: {
                        title: 'Justify (Auto-layout)',
                        type: 'select',
                        placeholder: 'Select justify align',
                        options: [
                            { value: 'none', title: 'None' },
                            { value: 'flex-start', title: 'Start' },
                            { value: 'center', title: 'Center' },
                            { value: 'flex-end', title: 'End' },
                            { value: 'space-between', title: 'Space between' },
                            { value: 'space-around', title: 'Space around' },
                            { value: 'space-evenly', title: 'Space evenly' },
                            { value: 'stretch', title: 'Stretch' },
                        ],
                        prop: 'justify-content'
                    },
                    align: {
                        title: 'Align (Auto-layout)',
                        type: 'select',
                        placeholder: 'Select align',
                        options: [
                            { value: 'none', title: 'None' },
                            { value: 'flex-start', title: 'Start' },
                            { value: 'center', title: 'Center' },
                            { value: 'flex-end', title: 'End' },
                            { value: 'stretch', title: 'Stretch' },
                        ],
                        prop: 'align-items'
                    },
                    gap: {
                        title: 'Gap (Auto-layout)',
                        type: 'units',
                        prop: 'gap'
                    }
                }
            }
        }
    }

    // Checking should we show category for this element based on category.for value
    filterCategory(forValue, tag) {
        tag = tag.toUpperCase()

        // For any element
        if(forValue === 'any')
            return true
        // Button element -> for has Text-Block?
        else if(tag === 'BUTTON')
            return forValue.includes('text-block')
        // Text element -> for has Text?
        else if(Utils.tagsWithText.includes(tag))
            return forValue.includes('text')
        // Block element -> for has Block?
        else
            return forValue.includes('block')
    }

    //#region Element property (get/set)
    getElementPropertyValue(el, styleProperty) {
        // Get from element style
        let value = el.style[styleProperty]
        
        // Get from computed style
        if(!value)
            value = window.getComputedStyle(el).getPropertyValue(styleProperty)

        // Transform to HEX if color
        if(styleProperty === 'background-color' || styleProperty === 'border-color' || styleProperty === 'outline-color' || styleProperty === 'color')
            value = Utils.cssRgbaToHex(value)

        return value
    }

    setElementPropertyValue(el, styleProperty, value) {
        el.style[styleProperty] = value
    }
    //#endregion

    __render__() {
        if(this.attachedEl) {
            this.innerHTML = ''

            // Make props fields
            Object.keys(this.baseProperties).forEach(categoryName => {
                let category = this.baseProperties[categoryName]
                // Convert property object to property field html
                if(this.filterCategory(category.for || 'any', this.attachedEl.tagName))
                    this.innerHTML += this.__categoryToElement__(categoryName, category)
            })

            // Categories toggling
            this.querySelectorAll('.category-title').forEach(categoryEl => {
                categoryEl.addEventListener('click', (e) => {
                    categoryEl.parentElement.classList.toggle('visible')
                })
            })
        
            // Apply values & watch changes
            this.querySelectorAll('.property-field').forEach(fieldEl => {
                let fieldObject = this.baseProperties[fieldEl.getAttribute('category')]
                    .fields[fieldEl.getAttribute('name')]
            
                // Get current value
                let currentValue = fieldObject.prop ? this.getElementPropertyValue(this.attachedEl, fieldObject.prop)
                    : fieldObject.get(this.attachedEl)

                const applyValue = (value) => {
                    value = value || ''

                    if(fieldObject.prop)
                        this.setElementPropertyValue(this.attachedEl, fieldObject.prop, value)
                    else
                        fieldObject.set(this.attachedEl, value)
                }

                // Basic input
                if(this.inputElements.includes(fieldEl.tagName)) {
                    // Apply value from attached element to the input
                    fieldEl.value = currentValue ?? ''

                    // Watch changes on the input
                    fieldEl.addEventListener('input', (e) => {
                        // Apply value to the attached element
                        applyValue(e.currentTarget.value?.toString())
                    })
                }
                // Buttons input
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
                            applyValue(e.currentTarget.getAttribute('value'))
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