export default {
    textualTags: [
        'P', 'SPAN', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6',
        'SMALL', 'LABEL',
        // Link
        'A',
        // List
        'UL', 'LI'
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