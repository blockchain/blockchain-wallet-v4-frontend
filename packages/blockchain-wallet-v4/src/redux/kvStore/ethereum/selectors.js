import {
  compose,
  curry,
  find,
  head,
  findIndex,
  propEq,
  path,
  prop
} from 'ramda'
import { ETHEREUM } from '../config'
import { kvStorePath } from '../../paths'

export const getMetadata = path([kvStorePath, ETHEREUM])

export const getAccounts = state =>
  getMetadata(state).map(path(['value', 'ethereum', 'accounts']))

export const getContext = state =>
  getAccounts(state).map(
    compose(
      prop('addr'),
      head
    )
  )

export const getDefaultAccount = state => getAccounts(state).map(head)

export const getDefaultAddress = state =>
  getDefaultAccount(state).map(prop('addr'))

export const getDefaultLabel = state =>
  getDefaultAccount(state).map(prop('label'))

export const getLegacyAccount = state =>
  getMetadata(state).map(path(['value', 'ethereum', 'legacy_account']))

export const getLegacyAccountAddress = state =>
  getLegacyAccount(state).map(prop('addr'))

export const getAccount = (state, address) =>
  getAccounts(state).map(find(propEq('addr', address)))

export const getAccountLabel = curry((state, address) =>
  getAccount(state, address).map(prop('label'))
)

export const getAccountIndex = (state, address) =>
  getAccounts(state).map(findIndex(propEq('addr', address)))

export const getEthereumTxNote = (state, txHash) =>
  getMetadata(state).map(path(['value', 'ethereum', 'tx_notes', txHash]))

export const getLatestTx = state =>
  getMetadata(state).map(path(['value', 'ethereum', 'last_tx']))

export const getLatestTxTimestamp = state =>
  getMetadata(state).map(path(['value', 'ethereum', 'last_tx_timestamp']))
