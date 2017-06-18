import { indexBy, map, prop, view, compose, is, pipe, curry } from 'ramda'
import Type from './Type'
import * as AddressBookEntry from './AddressBookEntry'

export class AddressBook extends Type {}

export const addressLabel = addr => AddressBook.define(addr)

export const selectAddressLabel = curry((addr, as) => view(addressLabel(addr), as))

export const toJS = pipe(AddressBook.guard, (addressBook) => {
  const addressBookList = addressBook.toList()
  return map(AddressBookEntry.toJS, addressBookList).toArray()
})

export const fromJS = (labels) => {
  if (is(AddressBook, labels)) {
    return labels
  } else {
    const addressBook = compose(indexBy(prop('addr')), map(AddressBookEntry.fromJS))(labels)
    return new AddressBook(addressBook)
  }
}

//missing reviver
