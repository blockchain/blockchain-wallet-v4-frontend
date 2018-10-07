import { curry, find, nth, propEq, path, prop } from 'ramda'
import { XLM } from '../config'
import { kvStorePath } from '../../paths'

export const getMetadata = path([kvStorePath, XLM])

export const getAccounts = state =>
  getMetadata(state).map(path(['value', 'xlm', 'accounts']))

export const getDefaultAccountIndex = state =>
  getMetadata(state).map(path(['value', 'xlm', 'default_account_idx']))

export const getDefaultAccount = state =>
  getAccounts(state).map(nth(getDefaultAccountIndex(state).getOrElse(0)))

export const getDefaultAccountId = state =>
  getDefaultAccount(state).map(prop('publicKey'))

export const getDefaultLabel = state =>
  getDefaultAccount(state).map(prop('label'))

export const getAccount = (state, accountId) =>
  getAccounts(state).map(find(propEq('publicKey', accountId)))

export const getAccountLabel = curry((state, accountId) =>
  getAccount(state, accountId).map(prop('label'))
)

export const getXLMTxNote = (state, txHash) =>
  getMetadata(state).map(path(['value', 'xlm', 'tx_notes', txHash]))
