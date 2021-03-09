import { is, pipe } from 'ramda'
import { set, view } from 'ramda-lens'

import Type from './Type'
import { iToJS } from './util'

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

export const toJS = pipe(AddressLabel.guard, iToJS)

export const reviver = jsObject => {
  return new AddressLabel(jsObject)
}

// setLabel :: String -> AddressLabel -> AddressLabel
export const setLabel = set(label)
