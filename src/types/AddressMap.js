import { indexBy, map, prop, view, compose, is, pipe } from 'ramda'
import Type from './Type'
import * as Address from './Address'

export class AddressMap extends Type {}

export const address = string => AddressMap.define(address)

export const selectAddress = string => view(address(string))

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
