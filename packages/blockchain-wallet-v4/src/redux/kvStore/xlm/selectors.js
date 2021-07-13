import { curry, find, findIndex, map, nth, path, prop, propEq } from 'ramda'

import { kvStorePath } from '../../paths'
import { XLM } from '../config'

export const getMetadata = path([kvStorePath, XLM])

export const getAccounts = state =>
  getMetadata(state).map(path(['value', 'accounts']))

export const getDefaultAccountIndex = state =>
  getMetadata(state).map(path(['value', 'default_account_idx']))

export const getDefaultAccount = state =>
  getAccounts(state).map(nth(getDefaultAccountIndex(state).getOrElse(0)))

export const getDefaultAccountId = state =>
  getDefaultAccount(state).map(prop('publicKey'))

export const getDefaultLabel = state =>
  getDefaultAccount(state).map(prop('label'))

export const getAccount = (state, accountId) =>
  getAccounts(state).map(find(propEq('publicKey', accountId)))

export const getAccountIndex = curry((accountId, state) =>
  getAccounts(state).map(findIndex(propEq('publicKey', accountId)))
)

export const getAccountLabel = curry((state, accountId) =>
  getAccount(state, accountId).map(prop('label'))
)

export const getXlmTxNotes = state =>
  getMetadata(state).map(path(['value', 'tx_notes']))

export const getXlmTxNote = (state, txHash) =>
  getXlmTxNotes(state).map(prop(txHash))

export const getContext = state =>
  getAccounts(state).map(map(prop('publicKey')))
