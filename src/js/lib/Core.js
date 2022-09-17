window.$deps = {}

// Creating data
window.ref = function(value, type = null) {
    return new Proxy({
        is: 'reference',
        // Dependencies
        dependencies: [],
        addDependency(dep) {
            if(typeof dep !== 'function') {
                console.error('Error: dependency was not a function', fn)
            }

            // Add to dependencies
            this.dependencies.push(dep)
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
                if(target.type != null) {}

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
window.el = function(selector) {
    if(selector == null) {
        selector = 'orcos-com'
    }

    let element = document.querySelector(selector)

    if(!element) {
        console.error(`Cannot find element with selector '${selector}'`)
        return
    }

    return new Proxy({ $el: element }, {
        get(target, prop) {
            if(prop in target.$el)
                return target.$el[prop]
            else if(prop === '$el')
                return target.$el
            else
                return undefined
        },
        set(target, prop, value) {
            if(prop in target.$el) {
                // Set reference value
                if(value?.is === 'reference') {
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