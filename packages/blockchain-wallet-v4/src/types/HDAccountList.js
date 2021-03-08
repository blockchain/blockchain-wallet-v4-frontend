import { addIndex, curry, filter, is, map, pipe } from 'ramda'
import { view } from 'ramda-lens'

import * as HDAccount from './HDAccount'
import List from './List'
import { iLensProp } from './util'

const mapIndexed = addIndex(map)

export class HDAccountList extends List {}

export const isHDAccountList = is(HDAccountList)

export const account = iLensProp

export const selectAccount = curry((index, as) =>
  pipe(HDAccountList.guard, view(iLensProp(index)))(as)
)

export const selectByXpub = curry((xpub, as) =>
  pipe(HDAccountList.guard, xs => xs.find(HDAccount.isXpub(xpub)))(as)
)

export const selectContext = pipe(HDAccountList.guard, accList => {
  return map(HDAccount.selectXpub, filter(HDAccount.isActive, accList))
})

export const selectActive = pipe(
  HDAccountList.guard,
  filter(HDAccount.isActive)
)

export const toJS = pipe(HDAccountList.guard, accList => {
  return map(HDAccount.toJS, accList).toArray()
})

export const toJSwithIndex = pipe(HDAccountList.guard, accList => {
  return map(HDAccount.toJSwithIndex, accList).toArray()
})

export const fromJS = accounts => {
  if (is(HDAccountList, accounts)) {
    return accounts
  } else {
    return new HDAccountList(mapIndexed(HDAccount.fromJS, accounts))
  }
}

export const reviver = jsObject => {
  return new HDAccountList(jsObject)
}
