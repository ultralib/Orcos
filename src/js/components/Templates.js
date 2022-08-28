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
            inner: `
                <style component-style scoped>
                    /* Core */
                    :host *,:host *::before,:host *::after{
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                        font-family: inherit;   
                    }
                    /* Panel, Grid */
                    [orcos-type="panel"],[orcos-type="grid"] {
                        grid-gap: 15px;
                        gap: 15px;
                    }
                    /* Button */
                    button {
                        padding: 0.8rem 1.2rem;
                        font-size: 1rem;
                        border: none;
                        outline: none;
                        border-radius: 12px;
                    }
                    /* Field */
                    input,textarea,select {
                        padding: 0.8rem 1.2rem;
                        background-color: #EFEFEF;
                        font-size: 1rem;
                        border: none;
                        outline: none;
                        border-radius: 12px;
                    }
                    /* Link */
                    a {
                        margin-bottom: 5px;
                        color: #0079ff;
                        text-decoration-color: #add2fc;
                        text-underline-offset: 3px;
                    }
                    /* Image */
                    img {
                        width: 50px;
                        height: 50px;
                        background-color: #EFEFEF;

                        border-radius: 12px;
                    }
                    /* Checkbox text */
                    label > input + span {
                        margin-left: 5px;
                        font-size: 1rem;
                    }
                    /* List */
                    ul {
                        padding-left: 20px;
                    }
                </style>
                <h1 style="margin:0px 0px 5px 0px;">Header</h1>
                <p>Some text</p>
            `
        }
    },
    elements: {
        text: element('p', 'Text'),
        link: element('a', 'Link', { href: '#' }),
        image: element('img', null, { 'orcos-name': 'Image', src: '' }),
        list: element('ul', '<li>One</li>'),
        panel: element('div', null, { 'orcos-name': 'Panel', 'orcos-type': 'panel', style: 'display:flex;' }),
        button: element('button', 'Button', { 'orcos-name': 'Button', style: 'display:block;outline:none;' }),
        grid: element('div', null, { 'orcos-name': 'Grid', 'orcos-type': 'grid', style: 'display:grid;' }),
        input: element('input', null, { 'orcos-name': 'Input', type: 'text', placeholder: 'Input', disabled: true }),
        checkbox: element('label', '<input type="checkbox" disabled><span>Text</span', { 'orcos-name': 'Checkbox' }),
    }
}