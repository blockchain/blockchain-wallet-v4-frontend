import { compose, view } from 'ramda'
import { Map } from 'immutable-ext'
import { iLensProp } from '../lens'
import { typeGuard, typeLens } from '../util'

export default class Type {
  constructor (x) {
    this.__internal = Map(x)
  }

  static get guard () {
    return typeGuard(this)
  }

  static get lens () {
    return typeLens(this)
  }

  static define (prop) {
    let defineProp = (prop) => compose(this.lens, iLensProp(prop))
    let propLens = defineProp(prop)
    Object.defineProperty(this.prototype, prop, {
      configurable: false,
      enumerable: true,
      get () { return view(propLens, this) }
    })
    return propLens
  }
}
