import { concat, curry, equals, keys, keysIn, filter, not, lift, map, path, prop } from 'ramda'
import { BCH } from '../config'
import { kvStorePath } from '../../paths'
import * as walletSelectors from '../../wallet/selectors'
import { createSelectorCreator, defaultMemoize } from 'reselect'

// TODO: Move to appropriate location (to define)
export const createDeepEqualSelector = createSelectorCreator(
  defaultMemoize,
  equals
)

export const getMetadata = path([kvStorePath, BCH])

// Attention: returns an object with index as keys, not an array
export const getAccounts = state => getMetadata(state).map(path(['value', 'accounts']))

// This one returns an array of accounts
export const getAccountsList = state => {
  const accountsObj = getAccounts(state)
  return lift(a => map(key => a[key], keys(a)))(accountsObj)
}

export const getContext = createDeepEqualSelector(
  [
    walletSelectors.getHDAccounts,
    walletSelectors.getActiveAddresses,
    getAccounts
  ],
  (btcHDAccounts, activeAddresses, metadataAccountsR) => {
    const transform = metadataAccounts => {
      const activeAccounts = filter(account => {
        const index = prop('index', account)
        const metadataAccount = metadataAccounts[index]
        return not(prop('archived', metadataAccount))
      }, btcHDAccounts)
      return map(prop('xpub'), activeAccounts)
    }
    const activeAccounts = metadataAccountsR.map(transform).getOrElse([])
    const addresses = keysIn(activeAddresses)
    return concat(activeAccounts, addresses)
  }
)

export const getSpendableContext = createDeepEqualSelector(
  [
    walletSelectors.getHDAccounts,
    walletSelectors.getSpendableContext,
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
    const addresses = keysIn(spendableAddresses)
    return concat(activeAccounts, addresses)
  }
)

export const getUnspendableContext = state => keys(walletSelectors.getUnspendableContext(state))

export const getDefaultAccountIndex = state => getMetadata(state).map(path(['value', 'default_account_idx']))

export const getAccountLabel = curry((state, index) => getAccounts(state).map(path([index, 'label'])))

export const getBchTxNote = (state, txHash) => getMetadata(state).map(path(['value', 'tx_notes', txHash]))
