import { is, pipe } from 'ramda'
import { view, set } from 'ramda-lens'
import { iToJS } from './util'
import Type from './Type'

/* AddressLabel :: {
  index :: Number
  label :: String
} */

export class AddressLabel extends Type {}

export const isAddressLabel = is(AddressLabel)

export const index = AddressLabel.define('index')
export const label = AddressLabel.define('label')

export const selectIndex = view(index)
export const selectLabel = view(label)

export const fromJS = x => (is(AddressLabel, x) ? x : new AddressLabel(x))

export const toJS = pipe(
  AddressLabel.guard,
  iToJS
)

export const reviver = jsObject => {
  return new AddressLabel(jsObject)
}

// setLabel :: String -> AddressLabel -> AddressLabel
export const setLabel = set(label)
