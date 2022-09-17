let $base = {
    console: {
        log: window.console.log,
        warn: window.console.warn,
        error: window.console.error,
    }
}
let $serialize = (val) => {
    // HTML Element
    if(val instanceof HTMLElement) {
        return `Element&lt;${val.tagName.toLowerCase()}&gt;`
    }
    // el()
    else if(val.$el) {
        return $serialize(val.$el)
    }
    // Error
    else if(val instanceof Error) {
        return { name: val.name, message: val.message }
    }
    else {
        return val
    }
}
let $log = (severity, args) => {
    try {
        window.parent.postMessage({ type: 'log', severity, args: args.map(arg => $serialize(arg)) }, '*')
    } catch {
        console.warn('Failed to log value, please check out DevTools for value')

        $base.console.log(...args)
    }
}

window.console.log = function(...args) {
    $log('info', args)
}
window.console.warn = function(...args) {
    $log('warning', args)
}
window.console.error = function(...args) {
    $log('error', args)
}