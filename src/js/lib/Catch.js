const $base = Object.freeze({
    console: {
        log: window.console.log,
        warn: window.console.warn,
        error: window.console.error,
    }
});

window.structuredClone = 'structuredClone' in window ? window.structuredClone : (item) => {
    // null, undefined values check
    if (!item) {
        return item;
    }

    let types = [ Number, String, Boolean ];
    let result;

    // Normalize primitives (like: new Number(100))
    for(let type of types) {
        if (item instanceof type) {
            result = type(item);
        }
    }

    if (typeof result == "undefined") {
        // Array
        if (Object.prototype.toString.call(item) === "[object Array]") {
            result = [];
            item.forEach((child, index) => { 
                result[index] = structuredClone(child);
            });
        }
        // Object
        else if (typeof item == "object") {
            // DOM
            if (item.nodeType && typeof item.cloneNode == "function") {
                result = item.cloneNode(true);
            }
            // Literal
            else if (!item.prototype) {
                // Date
                if (item instanceof Date) {
                    result = new Date(item);
                }
                else {
                    // Object literal
                    result = {}
                    for (var i in item) {
                        result[i] = structuredClone(item[i]);
                    }
                }
            }
            else {
                result = new item.constructor();
            }
        }
        else {
            result = item;
        }
    }

    return result;
};

const $serialize = (val) => {
    // el()
    if(val.$el) {
        return $serialize(val.$el)
    }
    // Error
    else if(val instanceof Error) {
        return { name: val.name, message: val.message }
    }
    // HTML
    else if(val instanceof HTMLElement) {
        return { tag: val.tagName, innerText: val.innerText }
    }
    else {
        return structuredClone(val)
    }
};

const $log = (severity, args) => {
    try {
        window.parent.postMessage({
            type: 'log',
            severity,
            args: args.map(arg => $serialize(arg))
        }, '*');
    }
    catch (e) {
        console.warn('Failed to log value, please check out DevTools for value');
        $base.console.log(...args);
    }
};

window.console.log = function(...args) {
    $log('info', args)
};
window.console.warn = function(...args) {
    $log('warning', args);
};
window.console.error = function(...args) {
    $log('error', args);
};