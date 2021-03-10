import {
  compose,
  curry,
  filter,
  indexBy,
  is,
  map,
  pipe,
  prop,
  reject
} from 'ramda'
import { view } from 'ramda-lens'

import * as Address from './Address'
import Type from './Type'
import { iLensProp } from './util'

export class AddressMap extends Type {}

export const isAddressMap = is(AddressMap)

// lenses
export const address = iLensProp

// selectors
export const selectAddress = curry((string, as) =>
  pipe(AddressMap.guard, view(address(string)))(as)
)
export const selectContext = pipe(AddressMap.guard, addressMap => {
  return addressMap.keySeq()
})
export const selectActive = pipe(AddressMap.guard, filter(Address.isActive))
export const selectArchived = pipe(AddressMap.guard, filter(Address.isArchived))
export const selectSpendable = pipe(
  AddressMap.guard,
  reject(Address.isWatchOnly)
)

export const deleteAddress = curry((string, addressMap) =>
  pipe(AddressMap.guard, amap => amap.delete(string))(addressMap)
)

// to/from js
export const toJS = pipe(AddressMap.guard, addressMap => {
  const addressList = addressMap.toList()
  return map(Address.toJS, addressList).toArray()
})

export const fromJS = keys => {
  if (is(AddressMap, keys)) {
    return keys
  } else {
    const addrs = compose(indexBy(prop('addr')), map(Address.fromJS))(keys)
    return new AddressMap(addrs)
  }
}

export const reviver = jsObject => {
  return new AddressMap(jsObject)
}
