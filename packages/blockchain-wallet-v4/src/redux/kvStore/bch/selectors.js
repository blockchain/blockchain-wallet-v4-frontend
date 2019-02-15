import {
  concat,
  curry,
  filter,
  not,
  lift,
  map,
  path,
  prop,
  values
} from 'ramda'
import { BCH } from '../config'
import { kvStorePath } from '../../paths'
import * as walletSelectors from '../../wallet/selectors'
import { createDeepEqualSelector } from '../../../utils'

export const getMetadata = path([kvStorePath, BCH])

// Attention: returns an object with index as keys, not an array
export const getAccounts = state =>
  getMetadata(state).map(path(['value', 'accounts']))

// This one returns an array of accounts
export const getAccountsList = state => {
  const accountsObj = getAccounts(state)
  return lift(values)(accountsObj)
}

export const getSpendableContext = createDeepEqualSelector(
  [
    walletSelectors.getHDAccounts,
    walletSelectors.getSpendableAddrContext,
    getAccounts
  ],
  (btcHDAccounts, spendableAddresses, metadataAccountsR) => {
    const transform = metadataAccounts => {
      const activeAccounts = filter(account => {
        const index = prop('index', account)
        const metadataAccount = metadataAccounts[index]
        return not(prop('archived', metadataAccount))
      }, btcHDAccounts)
      return map(prop('xpub'), activeAccounts)
    }
    const activeAccounts = metadataAccountsR.map(transform).getOrElse([])
    return concat(activeAccounts, spendableAddresses)
  }
)

export const getUnspendableContext = state =>
  walletSelectors.getUnspendableContext(state)

export const getDefaultAccountIndex = state =>
  getMetadata(state).map(path(['value', 'default_account_idx']))

export const getAccountLabel = curry((state, index) =>
  getAccounts(state).map(path([index, 'label']))
)

export const getBchTxNotes = state =>
  getMetadata(state).map(path(['value', 'tx_notes']))

export const getBchTxNote = (state, txHash) =>
  getMetadata(state).map(path(['value', 'tx_notes', txHash]))
