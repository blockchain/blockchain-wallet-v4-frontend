import * as eImmutable from 'extendable-immutable'
import { compose } from 'ramda'
import { view } from 'ramda-lens'

import { iLensProp, typeGuard, typeLens } from './util'

export default class List extends eImmutable.List {
  static get guard() {
    return typeGuard(this)
  }

  static get lens() {
    return typeLens(this)
  }

  get empty() {
    return new this.constructor([])
  }

  toJSON() {
    return { __serializedType__: this.constructor.name, data: this.toArray() }
  }

  static define(prop) {
    const defineProp = (prop) => compose(this.lens, iLensProp(prop))
    const propLens = defineProp(prop)
    Object.defineProperty(this.prototype, prop, {
      configurable: false,
      enumerable: true,
      get() {
        return view(propLens, this)
      }
    })
    return propLens
  }
}
