import { indexBy, map, prop, view, compose, is, pipe, curry } from 'ramda'
import Type from './Type'
import * as AddressLabel from './AddressLabel'

export class AddressLabelMap extends Type {}

export const isAddressLabelMap = is(AddressLabelMap)

export const addressLabel = index => AddressLabelMap.define(index)

export const selectAddressLabel = curry((index, as) => view(addressLabel(index.toString()), as))

export const toJS = pipe(AddressLabelMap.guard, (addressLabelMap) => {
  const addressLabelList = addressLabelMap.toList()
  return map(AddressLabel.toJS, addressLabelList).toArray()
})

export const fromJS = (labels) => {
  if (is(AddressLabelMap, labels)) {
    return labels
  } else {
    const addressLabels = compose(indexBy(prop('index')), map(AddressLabel.fromJS))(labels)
    return new AddressLabelMap(addressLabels)
  }
}

export const reviver = (jsObject) => {
  return new AddressLabelMap(jsObject)
}
