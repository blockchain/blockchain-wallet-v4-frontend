import { concat, curry, filter, keysIn, map, not, path, prop } from 'ramda'

import { dataPath } from '../../paths'
import { getAccounts } from '../../kvStore/bch/selectors'
import { createDeepEqualSelector } from '../../../utils'
import * as walletSelectors from '../../wallet/selectors'
import { getLockboxBchContext } from '../../kvStore/lockbox/selectors'

export const getWalletContext = createDeepEqualSelector(
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

export const getContext = createDeepEqualSelector(
  [getWalletContext, getLockboxBchContext],
  (walletContext, lockboxContextR) => {
    const lockboxContext = lockboxContextR.map(x => x).getOrElse([])
    return concat(walletContext, lockboxContext)
  }
)

export const getAddresses = path([dataPath, 'bch', 'addresses'])

export const getFee = path([dataPath, 'bch', 'fee'])

export const getInfo = path([dataPath, 'bch', 'info'])

export const getLatestBlock = path([dataPath, 'bch', 'latest_block'])

export const getRates = path([dataPath, 'bch', 'rates'])

export const getTransactions = path([dataPath, 'bch', 'transactions'])

export const getTransactionHistory = path([
  dataPath,
  'bch',
  'transaction_history'
])

export const getCoins = path([dataPath, 'bch', 'payment', 'coins'])

// Specific
export const getChangeIndex = curry((xpub, state) =>
  getAddresses(state).map(path([xpub, 'change_index']))
)

export const getReceiveIndex = curry((xpub, state) =>
  getAddresses(state).map(path([xpub, 'account_index']))
)

export const getTotalTxPerAccount = curry((xpubOrAddress, state) =>
  getAddresses(state).map(path([xpubOrAddress, 'n_tx']))
)

export const getFinalBalance = curry((state, address) =>
  getAddresses(state)
    .map(path([address, 'final_balance']))
    .map(x => x || 0)
)

export const getBalance = state => getInfo(state).map(path(['final_balance']))

export const getNumberTransactions = state => getInfo(state).map(path(['n_tx']))

export const getHeight = state => getLatestBlock(state).map(path(['height']))

export const getTime = state => getLatestBlock(state).map(path(['time']))

export const getHash = state => getLatestBlock(state).map(path(['hash']))

export const getIndex = state =>
  getLatestBlock(state).map(path(['block_index']))

export const getSelection = path([dataPath, 'bch', 'payment', 'selection'])

export const getEffectiveBalance = path([
  dataPath,
  'bch',
  'payment',
  'effectiveBalance'
])

export const getTransactionsAtBound = path([
  dataPath,
  'bch',
  'transactions_at_bound'
])
