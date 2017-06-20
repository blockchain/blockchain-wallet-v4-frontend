import { filter, map, prop, view, compose, is, pipe, curry } from 'ramda'
import List from './List'
import * as HDAccount from './HDAccount'

export class HDAccountList extends List {}

export const isHDAccountList = is(HDAccountList)

export const account = index => HDAccountList.define(index)

export const selectAccount = curry((index, as) => view(account(index), as))

export const selectContext = pipe(HDAccountList.guard, (accList) => {
  return map(HDAccount.selectXpub, accList)
})

export const selectActive = pipe(HDAccountList.guard, filter(HDAccount.isActive))

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

export const reviver = (jsObject) => {
  return new HDAccountList(jsObject)
}
