import { avalon, platform, modern } from '../seed/core'
import { $$skipArray } from './reserved'
import { Directive } from '../renders/Directive'
import './share'
import './ProxyArray'
export { avalon, platform }





export function hideProperty(host, name, value) {
    Object.defineProperty(host, name, {
        value: value,
        writable: true,
        enumerable: false,
        configurable: true
    })
}




function $fire(expr, a) {
    var list = this.$events[expr]
    if (Array.isArray(list)) {
        for (var i = 0, w; w = list[i++];) {
            w.callback.call(w.vm, a, w.value, w.expr)
        }
    }
}

function $watch(expr, callback, deep) {
    var core = this.$events
    var w = new Directive(this, {
        deep: deep,
        type: 'user',
        expr: expr
    }, callback)
    if (!core[expr]) {
        core[expr] = [w]
    } else {
        core[expr].push(w)
    }
    return function() {
        w.destroy()
        avalon.Array.remove(core[expr], w)
        if (core[expr].length === 0) {
            delete core[expr]
        }
    }
}
export function watchFactory(core) {
    return $watch
}

export function fireFactory(core) {
    return $fire
}


export function afterCreate(vm, core, keys) {
    var $accessors = vm.$accessors
        //隐藏系统属性
    for (var key in $$skipArray) {
        hideProperty(vm, key, vm[key])
    }
    //为不可监听的属性或方法赋值
    for (var i = 0; i < keys.length; i++) {
        key = keys[i]
        if (!(key in $accessors)) {
            vm[key] = core[key]
        }
    }
    vm.$track = keys.join('Ȣ')
    vm.$events.__proxy__ = vm
}

platform.fireFactory = fireFactory
platform.watchFactory = watchFactory
platform.afterCreate = afterCreate
platform.hideProperty = hideProperty
platform.toModel = function() {}
platform.createViewModel = Object.defineProperties