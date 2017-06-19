import { indexBy, map, prop, view, compose, is, pipe, curry, filter } from 'ramda'
import Type from './Type'
import * as Address from './Address'

export class AddressMap extends Type {}

export const isAddressMap = is(AddressMap)

export const address = string => AddressMap.define(address)

export const selectAddress = curry((string, as) => view(address(string), as))

export const selectContext = pipe(AddressMap.guard, (addressMap) => {
  return addressMap.keySeq()
})

export const selectActive = pipe(AddressMap.guard, filter(Address.isActive))

export const toJS = pipe(AddressMap.guard, (addressMap) => {
  const addressList = addressMap.toList()
  return map(Address.toJS, addressList).toArray()
})

export const fromJS = (keys) => {
  if (is(AddressMap, keys)) {
    return keys
  } else {
    const addrs = compose(indexBy(prop('addr')), map(Address.fromJS))(keys)
    return new AddressMap(addrs)
  }
}

export const reviver = (jsObject) => {
  return new AddressMap(jsObject)
}
