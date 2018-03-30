import { indexBy, map, prop, compose, is, pipe, curry } from 'ramda'
import { view } from 'ramda-lens'
import Type from './Type'
import * as AddressBookEntry from './AddressBookEntry'
import { iLensProp } from './util'

export class AddressBook extends Type {}

export const isAddressBook = is(AddressBook)

export const selectAddressLabel = curry((addr, as) => pipe(AddressBook.guard, view(iLensProp(addr)))(as))

export const toJS = pipe(AddressBook.guard, (addressBook) => {
  const addressBookList = addressBook.toList()
  return map(AddressBookEntry.toJS, addressBookList).toArray()
})

export const fromJS = (labels) => {
  if (is(AddressBook, labels)) {
    return labels
  } else if (labels == null) {
    return new AddressBook()
  } else {
    const addressBook = compose(indexBy(prop('addr')), map(AddressBookEntry.fromJS))(labels)
    return new AddressBook(addressBook)
  }
}

export const reviver = (jsObject) => {
  return new AddressBook(jsObject)
}
