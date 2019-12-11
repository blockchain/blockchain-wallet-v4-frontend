import * as walletSelectors from '../../wallet/selectors'
import { BCH } from '../config'
import {
  compose,
  concat,
  curry,
  filter,
  isNil,
  lift,
  map,
  not,
  path,
  prop,
  values
} from 'ramda'
import { createDeepEqualSelector } from '../../../utils'
import { kvStorePath } from '../../paths'

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

export const getLegacyAddrs = state => {
  return getMetadata(state).map(path(['value', 'addresses']))
}

export const getLegecyAddrsBalances = state =>
  map(map(digestAddress), getLegacyAddrs(state))

export const getLegacyAddrsList = state =>
  extract(getMetadata(state).map(path(['value', 'addresses'])))

const extract = addrs => {
  return Object.values(addrs.data)
}

const digestAddress = acc => ({
  coin: 'BCH',
  label: prop('label', acc) ? prop('label', acc) : prop('addr', acc),
  balance: path(['info', 'final_balance'], acc),
  address: prop('addr', acc),
  watchOnly: compose(
    isNil,
    prop('priv')
  )(acc),
  type: 'LEGACY'
})
