window.$deps = {}

const Is = {
    State: 'state'
}

// Creating reactive data
window.useState = function(value, type = null) {
    return new Proxy({
        is: Is.State,

        // Dependencies
        dependencies: [],
        addDependency(dep) {
            if(typeof dep !== 'function') {
                console.error('Error: dependency was not a function', fn)
            }

            // Add to dependencies
            this.dependencies.push(dep)
        },
        removeDependencies() {
            this.dependencies = []
        },

        // Value
        value: value,
        type: type
    }, {
        get(target, prop) {
            return target[prop]
        },
        set(target, prop, value) {
            // Update value
            if(prop === 'value') {
                // Validate type
                if(target.type != null) {

                }

                // Set new value
                target[prop] = value

                // Call dependencies with new value
                for(let dependency of target.dependencies) {
                    dependency(value)
                }

                // Success
                return true
            }
            return false
        },
        deleteProperty: () => false,
        ownKeys: () => ['addDependency', 'value', 'type']
    })
}

// Accessing elements
window.useElement = function(selector) {
    if(selector == null) {
        selector = 'orcos-com'
    }

    let element = document.querySelector(selector)

    if(!element) {
        console.error(`Cannot find element with selector '${selector}'`)
        return
    }

    let base = {
        $el: element,

        bind(ref) {
            // Check ref
            if(ref?.is !== Is.State) {
                throw new Error('Failed to bind: value was not reference')
            }

            // Assign initial value
            this.$el.value = ref.value

            // Bind on element change
            this.$el.addEventListener('change', (e) => {
                if(e.target.value) {
                    ref.value = e.target.value
                }
            })

            // Bind on ref change
            ref.addDependency((val) => {
                this.$el.value = val
            })
        }
    }
    return new Proxy(base, {
        get(target, prop) {
            // Get from element
            if(prop in target.$el)
                return target.$el[prop]
            // Get from root
            else if(prop in target)
                return target[prop]
            else
                return undefined
        },
        set(target, prop, value) {
            if(prop in target.$el) {
                // Set reference value
                if(value?.is === Is.State) {
                    // Set initial value
                    target.$el[prop] = value.value
                    // Add dependency to change value when ref changed
                    value.addDependency((newValue) => target.$el[prop] = newValue)
                }
                // Set basic value
                else {
                    target.$el[prop] = value
                }
                return true
            }
            else
                return false
        }
    })
}