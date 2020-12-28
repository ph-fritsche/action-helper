import { setFailed, setOutput } from '@actions/core'
import * as info from './index'

// Outputs are always exported as strings per JSON.stringify.
// When used in expressions, both 'false' and 'true' are considered truthy. '' and '0' are not.
// Typecasting falsy values to null / empty strings eases using them in conditionals.
function typeCast(v: unknown) {
    if (v === undefined || v === false) {
        return null
    } else {
        return v
    }
}

function run() {
    try {
        Object.keys(info).forEach(k => {
            setOutput(k, typeCast((info as {[k: string]: unknown})[k]))
        })
    } catch(e) {
        setFailed(e.message)
    }
}

run()
