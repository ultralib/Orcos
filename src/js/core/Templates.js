import CoreCSS from '!raw-loader!../lib/Core.css'

const element = (tag, text, attrs) => {
    let _el = document.createElement(tag)
    // Text
    if(text) _el.innerHTML = text
    if(attrs) {
        Object.keys(attrs).forEach(attrName => {
            _el.setAttribute(attrName, attrs[attrName])
        })
    }
    return _el
}

export default {
    components: {
        basic: {
            baseStyle: `
                width: 100%;
                max-width: 250px;
                padding: 15px 20px;
                display:flex;
                flex-direction:column;
                gap: 6px;
                border-radius:15px;
                background-color:white;
                font-family:'Inter','Roboto',sans-serif;
            `,
            baseLogic: `let count = ref(0)\nel('#counter').innerText = count\nel('#incrementBtn').onclick = () => { count.value++ }`,
            baseContent: `
                <style component-style scoped>${CoreCSS}</style>
                <h1 id="counter" style="margin:0px 0px 5px 0px;">0</h1>
                <button id="incrementBtn">Increment</button>
            `
        }
    },
    elements: {
        text: element('p', 'Text'),
        link: element('a', 'Link', { href: '#' }),
        image: element('img', null, { 'orcos-name': 'Image', src: '' }),
        list: element('ul', '<li>One</li>'),
        panel: element('div', null, { 'orcos-name': 'Panel', 'orcos-type': 'panel', style: 'display:flex;' }),
        button: element('button', 'Button', { 'orcos-name': 'Button' }),
        grid: element('div', null, { 'orcos-name': 'Grid', 'orcos-type': 'grid', style: 'display:grid;' }),
        input: element('input', null, { 'orcos-name': 'Input', type: 'text', placeholder: 'Input', disabled: true }),
        checkbox: element('label', '<input type="checkbox" disabled><span>Text</span', { 'orcos-name': 'Checkbox' }),
    }
}