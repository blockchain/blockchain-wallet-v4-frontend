import { concat, curry, indexOf, keys, keysIn, filter, not, lift, map, path, prop } from 'ramda'
import { BCH } from '../config'
import { kvStorePath } from '../../paths'
import * as walletSelectors from '../../wallet/selectors'

export const getMetadata = path([kvStorePath, BCH])

// Attention: returns an object with index as keys, not an array
export const getAccounts = state => getMetadata(state).map(path(['value', 'accounts']))

// This one returns an array of accounts
export const getAccountsList = state => {
  const accountsObj = getAccounts(state)
  return lift(a => map(key => a[key], keys(a)))(accountsObj)
}

export const getContext = (state) => {
  const btcHDAccounts = walletSelectors.getHDAccounts(state)
  const metadataAccountsR = getAccounts(state)

  const transform = metadataAccounts => {
    const activeAccounts = filter(account => {
      const index = prop('index', account)
      const metadataAccount = indexOf(index, metadataAccounts)
      return not(prop('archived', metadataAccount))
    }, btcHDAccounts)
    return map(prop('xpub'), activeAccounts)
  }
  const activeAccounts = metadataAccountsR.map(transform).getOrElse([])
  const addresses = keysIn(walletSelectors.getActiveAddresses(state))
  return concat(activeAccounts, addresses)
}

export const getSpendableContext = (state) => {
  const btcHDAccounts = walletSelectors.getHDAccounts(state)
  const metadataAccountsR = getAccounts(state)

  const transform = metadataAccounts => {
    const activeAccounts = filter(account => {
      const index = prop('index', account)
      const metadataAccount = indexOf(index, metadataAccounts)
      return not(prop('archived', metadataAccount))
    }, btcHDAccounts)
    return map(prop('xpub'), activeAccounts)
  }
  const activeAccounts = metadataAccountsR.map(transform).getOrElse([])
  const spendableAddresses = keysIn(walletSelectors.getSpendableAddresses(state))
  return concat(activeAccounts, spendableAddresses)
}

export const getUnspendableContext = (state) => {
  const btcHDAccounts = walletSelectors.getHDAccounts(state)
  const metadataAccountsR = getAccounts(state)

  const transform = metadataAccounts => {
    const activeAccounts = filter(account => {
      const index = prop('index', account)
      const metadataAccount = indexOf(index, metadataAccounts)
      return not(prop('archived', metadataAccount))
    }, btcHDAccounts)
    return map(prop('xpub'), activeAccounts)
  }
  const activeAccounts = metadataAccountsR.map(transform).getOrElse([])
  const unspendableAddresses = keysIn(walletSelectors.getUnspendableAddresses(state))
  return concat(activeAccounts, unspendableAddresses)
}

export const getDefaultAccountIndex = state => getMetadata(state).map(path(['value', 'default_account_idx']))

export const getAccountLabel = curry((state, index) => getAccounts(state).map(path([index, 'label'])))

export const getBchTxNote = (state, txHash) => getMetadata(state).map(path(['value', 'tx_notes', txHash]))
