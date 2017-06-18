import { map, prop, view, compose, is, pipe, curry } from 'ramda'
import TypeList from './TypeList'
import * as HDAccount from './HDAccount'

export class HDAccountList extends TypeList {}

export const account = index => HDAccountList.define(index)

export const selectAccount = curry((index, as) => view(account(index), as))

export const toJS = pipe(HDAccountList.guard, (accList) => {
  return map(HDAccount.toJS, accList).toArray()
})

export const fromJS = (accounts) => {
  if (is(HDAccountList, accounts)) {
    return accounts
  } else {
    return new HDAccountList(map(HDAccount.fromJS, accounts))
  }
}
