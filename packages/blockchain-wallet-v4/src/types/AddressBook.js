import * as AddressBookEntry from './AddressBookEntry'
import { compose, curry, indexBy, is, map, pipe, prop } from 'ramda'
import { iLensProp } from './util'
import { view } from 'ramda-lens'
import Type from './Type'

export class AddressBook extends Type {}

export const isAddressBook = is(AddressBook)

export const selectAddressLabel = curry((addr, as) =>
  pipe(AddressBook.guard, view(iLensProp(addr)))(as)
)

export const toJS = pipe(AddressBook.guard, addressBook => {
  const addressBookList = addressBook.toList()
  return map(AddressBookEntry.toJS, addressBookList).toArray()
})

export const fromJS = labels => {
  if (is(AddressBook, labels)) {
    return labels
  } else if (labels == null) {
    return new AddressBook()
  } else {
    const addressBook = compose(
      indexBy(prop('addr')),
      map(AddressBookEntry.fromJS)
    )(labels)
    return new AddressBook(addressBook)
  }
}

export const reviver = jsObject => {
  return new AddressBook(jsObject)
}
