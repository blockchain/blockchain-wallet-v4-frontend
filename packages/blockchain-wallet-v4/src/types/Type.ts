import * as eImmutable from 'extendable-immutable'
import { compose } from 'ramda'
import { view } from 'ramda-lens'

import { iLensProp, typeGuard, typeLens } from './util'

export default class Type extends eImmutable.Map<{}, {}> {
  static get guard() {
    return typeGuard(this)
  }

  static get lens() {
    return typeLens(this)
  }

  get empty() {
    // @ts-ignore
    return new this.constructor({})
  }

  toJSON() {
    return { data: this.toObject(), __serializedType__: this.constructor.name }
  }

  static define(prop) {
    let defineProp = prop => compose(this.lens, iLensProp(prop))
    let propLens = defineProp(prop)
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
