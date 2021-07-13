import { compose, curry, indexBy, is, map, pipe, prop } from 'ramda'
import { view } from 'ramda-lens'

import * as AddressLabel from './AddressLabel'
import Type from './Type'
import { iLensProp } from './util'

export class AddressLabelMap extends Type {}

export const isAddressLabelMap = is(AddressLabelMap)

export const addressLabel = iLensProp

export const selectAddressLabel = curry((index, as) =>
  pipe(AddressLabelMap.guard, view(addressLabel(index)))(as)
)

export const toJS = pipe(AddressLabelMap.guard, addressLabelMap => {
  const addressLabelList = addressLabelMap.toList()
  return map(AddressLabel.toJS, addressLabelList).toArray()
})

export const deleteLabel = curry((index, addressLabelMap) =>
  pipe(AddressLabelMap.guard, amap => amap.delete(index.toString()))(
    addressLabelMap
  )
)

export const setLabel = curry((index, label, addressLabelMap) =>
  pipe(AddressLabelMap.guard, amap =>
    amap.set(index.toString(), AddressLabel.fromJS({ index, label }))
  )(addressLabelMap)
)

export const fromJS = (labels = []) => {
  if (is(AddressLabelMap, labels)) {
    return labels
  } else {
    const addressLabels = compose(
      indexBy(prop('index')),
      map(AddressLabel.fromJS)
    )(labels)
    return new AddressLabelMap(addressLabels)
  }
}

export const reviver = jsObject => {
  return new AddressLabelMap(jsObject)
}
