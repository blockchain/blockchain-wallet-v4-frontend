import { is, pipe } from 'ramda'
import { iToJS } from './util'
import { set, view } from 'ramda-lens'
import Type from './Type'

/* AddressBookEntry :: {
  addr :: String
  label :: String
} */

export class AddressBookEntry extends Type {}

export const isAddressBookEntry = is(AddressBookEntry)

export const addr = AddressBookEntry.define('addr')
export const label = AddressBookEntry.define('label')

export const selectAddr = view(addr)
export const selectLabel = view(label)

export const fromJS = x =>
  is(AddressBookEntry, x) ? x : new AddressBookEntry(x)

export const toJS = pipe(AddressBookEntry.guard, iToJS)

export const reviver = jsObject => {
  return new AddressBookEntry(jsObject)
}

// setLabel :: String -> AddressBookEntry -> AddressBookEntry
export const setLabel = set(label)
