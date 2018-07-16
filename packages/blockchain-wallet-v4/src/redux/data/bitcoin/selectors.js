import { curry, path } from 'ramda'
import { dataPath } from '../../paths'

export const getAddresses = path([dataPath, 'bitcoin', 'addresses'])

export const getFee = path([dataPath, 'bitcoin', 'fee'])

export const getInfo = path([dataPath, 'bitcoin', 'info'])

export const getLatestBlock = path([dataPath, 'bitcoin', 'latest_block'])

export const getRates = path([dataPath, 'bitcoin', 'rates'])

export const getTransactions = path([dataPath, 'bitcoin', 'transactions'])

export const getTransactionHistory = path([dataPath, 'bitcoin', 'transaction_history'])

export const getCoins = path([dataPath, 'bitcoin', 'payment', 'coins'])

export const getSpendableBalance = path([dataPath, 'bitcoin', 'spendable_balance'])

export const getUnspendableBalance = path([dataPath, 'bitcoin', 'unspendable_balance'])

// Specific
export const getChangeIndex = curry((xpub, state) => getAddresses(state).map(path([xpub, 'change_index'])))

export const getReceiveIndex = curry((xpub, state) => getAddresses(state).map(path([xpub, 'account_index'])))

export const getTotalTxPerAccount = curry((xpubOrAddress, state) => getAddresses(state).map(path([xpubOrAddress, 'n_tx'])))

export const getFeeRegular = state => getFee(state).map(path(['regular']))

export const getFeePriority = state => getFee(state).map(path(['priority']))

export const getBalance = state => getInfo(state).map(path(['final_balance']))

export const getNumberTransactions = state => getInfo(state).map(path(['n_tx']))

export const getHeight = state => getLatestBlock(state).map(path(['height']))

export const getTime = state => getLatestBlock(state).map(path(['time']))

export const getHash = state => getLatestBlock(state).map(path(['hash']))

export const getIndex = state => getLatestBlock(state).map(path(['block_index']))

export const getSelection = path([dataPath, 'bitcoin', 'payment', 'selection'])

export const getEffectiveBalance = path([dataPath, 'bitcoin', 'payment', 'effectiveBalance'])

export const getFiatAtTime = curry((hash, currency, state) => path([dataPath, 'bitcoin', 'transactions_fiat', hash, currency], state))

export const getAllFiatAtTime = path([dataPath, 'bitcoin', 'transactions_fiat'])
