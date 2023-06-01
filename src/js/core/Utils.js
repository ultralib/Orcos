const textualTags = [
    'P', 'SPAN', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6',
    'SMALL', 'LABEL', 'PRE', 'CODE',
    // Link
    'A',
    // List
    'UL', 'LI'
]

export default {
    textualTags: textualTags,
    editableTags: [
        ...textualTags,
        'BUTTON'
    ],
    tagsWithText: [
        ...textualTags,
        'BUTTON',
        'INPUT',
    ],
    parentTags: [
        'DIV'
    ],
    nonvisualTags: [
        'STYLE', 'SCRIPT', 'LINK', 'META'
    ],

    fonts: {
        macOs: [
            'American Typewriter',
            'Andale Mono',
            'Arial',
            'Arial Black',
            'Arial Narrow',
            'Arial Rounded MT Bold',
            'Arial Unicode MS',
            'Avenir',
            'Avenir Next',
            'Avenir Next Condensed',
            'Baskerville',
            'Big Caslon',
            'Bodoni 72',
            'Bodoni 72 Oldstyle',
            'Bodoni 72 Smallcaps',
            'Bradley Hand',
            'Brush Script MT',
            'Chalkboard',
            'Chalkboard SE',
            'Chalkduster',
            'Charter',
            'Cochin',
            'Comic Sans MS',
            'Copperplate',
            'Courier',
            'Courier New',
            'Didot',
            'DIN Alternate',
            'DIN Condensed',
            'Futura',
            'Geneva',
            'Georgia',
            'Gill Sans',
            'Helvetica',
            'Helvetica Neue',
            'Herculanum',
            'Hoefler Text',
            'Impact',
            'Lucida Grande',
            'Luminari',
            'Marker Felt',
            'Menlo',
            'Microsoft Sans Serif',
            'Monaco',
            'Noteworthy',
            'Optima',
            'Palatino',
            'Papyrus',
            'Phosphate',
            'Rockwell',
            'Savoye LET',
            'SignPainter',
            'Skia',
            'Snell Roundhand',
            'Tahoma',
            'Times',
            'Times New Roman',
            'Trattatello',
            'Trebuchet MS',
            'Verdana',
            'Zapfino'
        ]
    },

    cssRgbaToHex(rgba) {
        if(rgba.startsWith('#'))
            return rgba
        else if(rgba === 'white')
            return '#ffffff'
        else if(rgba === 'black')
            return '#000000'
        else
            return `#${rgba.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+\.{0,1}\d*))?\)$/).slice(1).map((n, i) => (i === 3 ? Math.round(parseFloat(n) * 255) : parseFloat(n)).toString(16).padStart(2, '0').replace('NaN', '')).join('')}`
    },

    generateRandom(length) {
        const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'

        let randomChars = ''
        for (let i = 0; i < length; i++ ) {
            randomChars += chars.charAt(Math.floor(Math.random() * chars.length))
        }
        return randomChars
    },

    every(element, handler) {
        let walk = (el) => {
            // Handle current elemtn
            handler(el)
            // Walk every children
            for(let child of el.children)
                walk(child)
        }
        walk(element)
    }
}