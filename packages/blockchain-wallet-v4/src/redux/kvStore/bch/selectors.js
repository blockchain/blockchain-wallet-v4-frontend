import { curry, keys, filter, reject, lift, map, path } from 'ramda'
import { BCH } from '../config'
import { kvStorePath } from '../../paths'
import * as walletSelectors from '../../wallet/selectors'

const isSpendable = (a) => a.priv
export const getMetadata = path([kvStorePath, BCH])

// Attention: returns an object with index as keys, not an array
export const getAccounts = state => getMetadata(state).map(path(['value', 'accounts']))

// This one returns an array of accounts
export const getAccountsList = state => {
  const accountsObj = getAccounts(state)
  return lift(a => map(key => a[key], keys(a)))(accountsObj)
}

export const getContext = (state) => {
  const btcHDAccountContext = walletSelectors.getHDAccounts(state)
  const btcContext = btcHDAccountContext.map(x => x.xpub)
  try {
    const accountsObj = getAccounts(state)
    const xpubs = filter(x => x.includes('xpub'), btcContext)
    const btcAddressesContext = walletSelectors.getAddressContext(state)

    return xpubs.filter((xpub, i) => !accountsObj.data[i].archived).concat(btcAddressesContext)
  } catch (e) {
    return btcContext
  }
}

export const getSpendableContext = (state) => {
  const btcHDAccountContext = walletSelectors.getHDAccounts(state)
  const btcContext = btcHDAccountContext.map(x => x.xpub)
  try {
    const accountsObj = getAccounts(state)
    const xpubs = filter(x => x.includes('xpub'), btcContext)
    const btcAddressesContext = filter(isSpendable, walletSelectors.getAddressContext(state))

    return xpubs.filter((xpub, i) => !accountsObj.data[i].archived).concat(btcAddressesContext)
  } catch (e) {
    return btcContext
  }
}

export const getUnspendableContext = (state) => {
  const btcAddressesContext = walletSelectors.getAddressContext(state)
  return reject(isSpendable, btcAddressesContext)
}

export const getDefaultAccountIndex = state => getMetadata(state).map(path(['value', 'default_account_idx']))

export const getAccountLabel = curry((state, index) => getAccounts(state).map(path([index, 'label'])))

export const getBchTxNote = (state, txHash) => getMetadata(state).map(path(['value', 'tx_notes', txHash]))
