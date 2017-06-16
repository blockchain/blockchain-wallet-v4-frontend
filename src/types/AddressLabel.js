import * as R from 'ramda'
import { Map } from 'immutable-ext'
import Type from './Type'

/* AddressLabel :: {
  index :: Number
  label :: String
} */

export class AddressLabel extends Type {}

export const index = AddressLabel.define('index')
export const label = AddressLabel.define('label')

export const selectIndex = R.view(index)
export const selectLabel = R.view(label)

export const fromJS = (x) => {
  if (x instanceof AddressLabel) { return x }
  return new AddressLabel(x)
}

export const toJS = R.pipe(AddressLabel.guard, (addressLabel) => {
  return addressLabel.__internal.toJS()
})

export const toJSON = R.pipe(AddressLabel.guard, (addressLabel) => {
  return addressLabel.__internal.toJS()
})

export const fromJSON = (jsObject) => {
  return new AddressLabel(jsObject)
}

// setLabel :: String -> AddressLabel -> AddressLabel
export const setLabel = R.set(label)
