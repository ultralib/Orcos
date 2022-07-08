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
    },
    elements: {
        text: element('p', 'Text'),
        link: element('a', 'Link', { href: '#' }),
        image: element('img', null, { 'orcos-name': 'Image', src: '' }),
        list: element('ul', '<li>One</li>'),
        panel: element('div', null, { 'orcos-name': 'Panel', style: 'display:block;' }),
        button: element('button', 'Button', { 'orcos-name': 'Button', style: 'display:block;outline:none;' }),
        grid: element('div', null, { 'orcos-name': 'Grid', style: 'display:grid;' }),
        input: element('input', null, { 'orcos-name': 'Input', type: 'text', disabled: true }),
        checkbox: element('label', '<input type="checkbox" disabled><span>Text</span', { 'orcos-name': 'Checkbox' }),
    }
}