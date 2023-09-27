import * as monaco from 'monaco-editor'
import '../../lib/core.js'

const { editor, languages } = monaco

export const OrcosCodeEditor = class extends HTMLElement {
    root = null
    #code = ''

    constructor() {
        super()
    }

    addAutocomplete(obj) { 
        // Disable default autocompletion for javascript
        //languages.typescript.javascriptDefaults.setCompilerOptions({ noLib: true  })
    
        function getType(thing, isMember) {
            isMember =  (isMember == undefined) ? (typeof isMember == "boolean") ? isMember : false : false // Give isMember a default value of false
            
            switch ((typeof thing).toLowerCase()) { 
                case "object": {
                    return languages.CompletionItemKind.Class
                }
                case "function": {
                    return (isMember) ? languages.CompletionItemKind.Method : languages.CompletionItemKind.Function
                }
                default: { 
                    return (isMember) ? languages.CompletionItemKind.Property : languages.CompletionItemKind.Variable
                }
            }
        }
    
        // Register provider
        languages.registerCompletionItemProvider('javascript', {
            triggerCharacters: ['.', '('],
            provideCompletionItems: (model, position, token) => {
                // Split everything the user has typed on the current line up at each space, and only look at the last word
                let last_chars = model.getValueInRange({startLineNumber: position.lineNumber, startColumn: 0, endLineNumber: position.lineNumber, endColumn: position.column})
                let words = last_chars.replace("\t", "").split(" ")
                let active_typing = words[words.length - 1] // What the user is currently typing (everything after the last space)
                
                // This if statement adds support for autocomplete inside if statements and stuff
                if (active_typing.includes('(')) {
                    active_typing = active_typing.split('(')
                    active_typing = active_typing[active_typing.length - 1]
                }
        
                // If the last character typed is a period then we need to look at member objects of the obj object 
                let is_member = active_typing.charAt(active_typing.length - 1) == "."

                // Array of autocompletion results
                let result = []
                    
                // Used for generic handling between member and non-member objects
                let last_token = obj
                let prefix = ''
            
                if (is_member) { 
                    // Is a member, get a list of all members, and the prefix
                    let parents = active_typing.substring(0, active_typing.length - 1).split(".")
                    last_token = obj[parents[0]]
                    prefix = parents[0]

                    // Loop through all the parents the current one will have (to generate prefix)
                    for (let i = 1; i < parents.length; i++) { 
                        var propToLookFor = parents[i]
                        
                        // Support for arrays
                        var isPropAnArray = propToLookFor.charAt(propToLookFor.length - 1) == ']'
                        if (isPropAnArray)
                        propToLookFor = propToLookFor.split('[')[0]

                        if (last_token.hasOwnProperty(propToLookFor)) { 
                        prefix += '.' + propToLookFor;
                        last_token = last_token[propToLookFor]

                        if (isPropAnArray && Array.isArray(last_token))
                        {
                            last_token = last_token[0]
                        }
                        } else { 
                        // Not valid
                        return result
                        }
                    }
                
                    prefix += '.'
                }
                
                // Array properties
                if (Array.isArray(last_token)) {
                    last_token = { length: 0 }
                }
                
                // Get all the child properties of the last token
                for (let prop in last_token) { 
                    // Do not show properites that begin with "__"
                    if (last_token.hasOwnProperty(prop) && !prop.startsWith("__")) { 
                        // Get the detail type (try-catch) incase object does not have prototype 
                        var details = ''; 
                        try { 
                        details = last_token[prop].__proto__.constructor.name; 
                        } catch (e) { 
                        details = typeof last_token[prop]; 
                        }
                        
                        // Create completion object
                        var to_push = {
                        label: prefix + prop,
                        kind: getType(last_token[prop], is_member), 
                        detail: details,     
                        insertText: prop
                        };

                        // Change insertText and documentation for functions
                        if (to_push.detail.toLowerCase() == 'function') { 
                        to_push.insertText += "(";
                        to_push.documentation = (last_token[prop].toString()).split("{")[0]; // Show function prototype in the documentation popup
                        }

                        // Add to final results
                        result.push(to_push);
                    }
                }

                return {
                    suggestions: result
                }
            }
        })
    }

    async load() {
        let theme = await import('monaco-themes/themes/iPlastic.json')
        editor.defineTheme('iplastic', theme);

        this.root = editor.create(this.rootElement, {
            fontSize: '18px',
            fontFamily: "Menlo, Monaco, 'Courier New', monospace",
            lineHeight: 24,
            tabSize: 4,
            minimap: { enabled: false },
            parameterHints: { enabled: true },
            scrollBeyondLastLine: false,
            value: '',
            //theme: 'iplastic',
            language: 'javascript'
        })
        this.root.setValue(this.#code)

        // Enable autocompletion
        this.addAutocomplete({
            ref: window.ref,
            el: window.el
        })
    }

    set code(value) {
        if(this.root)
            this.root.setValue(value)
        else
            this.#code = value
    }
    get code() {
        if(this.root)
            return this.root.getValue()
        else
            return this.#code
    }

    connectedCallback() {
        this.innerHTML = `
            <div id="code-editor-root"></div>
        `

        // Get root element
        this.rootElement = this.querySelector('#code-editor-root')

        // Load editor
        this.load()
    }
}

customElements.define('orcos-code-editor', OrcosCodeEditor)