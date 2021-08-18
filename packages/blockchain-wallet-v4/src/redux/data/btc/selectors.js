import { assoc, concat, curry, path, propOr } from 'ramda'

import { createDeepEqualSelector } from '../../../utils'
import { getLockboxBtcContext } from '../../kvStore/lockbox/selectors'
import { dataPath } from '../../paths'
import * as wallet from '../../wallet/selectors'

export const getWalletContext = createDeepEqualSelector(
  [wallet.getContextGrouped],
  (walletContext) => walletContext
)

export const getContext = createDeepEqualSelector(
  [wallet.getContextGrouped, getLockboxBtcContext],
  (walletContext, lockboxContextR) => {
    const lockboxContext = lockboxContextR.map((x) => x).getOrElse([])
    const legacyContext = propOr([], 'legacy', walletContext)
    return assoc('legacy', concat(legacyContext, lockboxContext), walletContext)
  }
)

export const getAddresses = path([dataPath, 'btc', 'addresses'])

export const getFee = path([dataPath, 'btc', 'fee'])

export const getInfo = path([dataPath, 'btc', 'info'])

export const getLatestBlock = path([dataPath, 'btc', 'latest_block'])

export const getRates = path([dataPath, 'btc', 'rates'])

export const getTransactions = path([dataPath, 'btc', 'transactions'])

export const getTransactionHistory = path([dataPath, 'btc', 'transaction_history'])

export const getCoins = path([dataPath, 'btc', 'payment', 'coins'])

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

export const getFinalBalanceLegacy = curry((state, address) =>
  getAddresses(state)
    .map(path([address, 'final_balance']))
    .map((x) => x || 0)
)

export const getFinalBalance = curry((state, address) =>
  getAddresses(state)
    .map((addresses) =>
      address.map
        ? address.map((addr) => path([addr, 'final_balance'], addresses))
        : path([address, 'final_balance'], addresses)
    )
    .map((x) => x || 0)
)

export const getFeeRegular = (state) => getFee(state).map(path(['regular']))

export const getFeePriority = (state) => getFee(state).map(path(['priority']))

export const getBalance = (state) => getInfo(state).map(path(['final_balance']))

export const getNumberTransactions = (state) => getInfo(state).map(path(['n_tx']))

export const getHeight = (state) => getLatestBlock(state).map(path(['height']))

export const getTime = (state) => getLatestBlock(state).map(path(['time']))

export const getHash = (state) => getLatestBlock(state).map(path(['hash']))

export const getIndex = (state) => getLatestBlock(state).map(path(['block_index']))

export const getSelection = path([dataPath, 'btc', 'payment', 'selection'])

export const getEffectiveBalance = path([dataPath, 'btc', 'payment', 'effectiveBalance'])

export const getFiatAtTime = curry((hash, currency, state) =>
  path([dataPath, 'btc', 'transactions_fiat', hash, currency], state)
)

export const getAllFiatAtTime = path([dataPath, 'btc', 'transactions_fiat'])

export const getTransactionsAtBound = path([dataPath, 'btc', 'transactions_at_bound'])
