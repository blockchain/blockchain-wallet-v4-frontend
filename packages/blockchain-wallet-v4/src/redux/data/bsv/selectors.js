import {
  concat,
  curry,
  filter,
  keysIn,
  map,
  not,
  path,
  prop,
  reduce,
  unapply
} from 'ramda'

import { dataPath } from '../../paths'
import { getAccounts } from '../../kvStore/bsv/selectors'
import { createDeepEqualSelector } from '../../../utils'
import * as walletSelectors from '../../wallet/selectors'

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
    const concatAll = unapply(reduce(concat, []))
    return concatAll(activeAccounts, addresses)
  }
)

export const getAddresses = path([dataPath, 'bsv', 'addresses'])

export const getFee = path([dataPath, 'bsv', 'fee'])

export const getInfo = path([dataPath, 'bsv', 'info'])

export const getLatestBlock = path([dataPath, 'bsv', 'latest_block'])

export const getRates = path([dataPath, 'bsv', 'rates'])

export const getTransactions = path([dataPath, 'bsv', 'transactions'])

export const getCoins = path([dataPath, 'bsv', 'payment', 'coins'])

export const getChangeIndex = curry((xpub, state) =>
  getAddresses(state).map(path([xpub, 'change_index']))
)

export const getReceiveIndex = curry((xpub, state) =>
  getAddresses(state).map(path([xpub, 'account_index']))
)

export const getTotalTxPerAccount = curry((xpubOrAddress, state) =>
  getAddresses(state).map(path([xpubOrAddress, 'n_tx']))
)

export const getFinalBalance = curry((address, state) =>
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

export const getSelection = path([dataPath, 'bsv', 'payment', 'selection'])

export const getEffectiveBalance = path([
  dataPath,
  'bsv',
  'payment',
  'effectiveBalance'
])

export const getTransactionsAtBound = path([
  dataPath,
  'bsv',
  'transactions_at_bound'
])
