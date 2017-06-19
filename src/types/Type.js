import { compose, view } from 'ramda'
import { iLensProp } from '../lens'
import { typeGuard, typeLens } from '../util'
import * as eImmutable from 'extendable-immutable'

export default class Type extends eImmutable.Map {
  static get guard () {
    return typeGuard(this)
  }

  static get lens () {
    return typeLens(this)
  }

  get empty () {
    return new this.constructor({})
  }

  toJSON () {
    return { data: this.toObject(), __serializedType__: this.constructor.name }
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
