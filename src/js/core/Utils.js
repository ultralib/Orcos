export default new (class Utils {
    deepClone(item) {
        if (!item) { return item } // null, undefined values check
    
        let types = [ Number, String, Boolean ]
        let result
    
        // Normalize primitives (like: new Number(100))
        for(let type of types) {
            if (item instanceof type) {
                result = type(item)
            }
        }
    
        if (typeof result == "undefined") {
            // Array
            if (Object.prototype.toString.call(item) === "[object Array]") {
                result = []
                item.forEach(function(child, index, array) { 
                    result[index] = clone(child)
                })
            }
            else if (typeof item == "object") {
                // DOM
                if (item.nodeType && typeof item.cloneNode == "function") {
                    result = item.cloneNode(true)
                }
                // Literal
                else if (!item.prototype) {
                    // Date
                    if (item instanceof Date) {
                        result = new Date(item)
                    }
                    else {
                        // Object literal
                        result = {}
                        for (var i in item) {
                            result[i] = clone(item[i])
                        }
                    }
                }
                else {
                    result = new item.constructor()
                }
            }
            else {
                result = item
            }
        }
    
        return result
    }
})