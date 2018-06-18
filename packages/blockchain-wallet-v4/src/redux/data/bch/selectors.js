import { curry, path } from 'ramda'
import { dataPath } from '../../paths'

export const getAddresses = path([dataPath, 'bch', 'addresses'])

export const getFee = path([dataPath, 'bch', 'fee'])

export const getInfo = path([dataPath, 'bch', 'info'])

export const getLatestBlock = path([dataPath, 'bch', 'latest_block'])

export const getRates = path([dataPath, 'bch', 'rates'])

export const getTransactions = path([dataPath, 'bch', 'transactions'])

export const getTransactionHistory = path([dataPath, 'bch', 'transaction_history'])

export const getCoins = path([dataPath, 'bch', 'payment', 'coins'])

// Specific
export const getChangeIndex = curry((xpub, state) => getAddresses(state).map(path([xpub, 'change_index'])))

export const getReceiveIndex = curry((xpub, state) => getAddresses(state).map(path([xpub, 'account_index'])))

export const getTotalTxPerAccount = curry((xpubOrAddress, state) => getAddresses(state).map(path([xpubOrAddress, 'n_tx'])))

export const getFinalBalance = curry((address, state) => getAddresses(state).map(path([address, 'final_balance'])).map(x => x || 0))

// TODO: Import fee from wallet-options
// export const getFees = ...

export const getBalance = state => getInfo(state).map(path(['final_balance']))

export const getNumberTransactions = state => getInfo(state).map(path(['n_tx']))

export const getHeight = state => getLatestBlock(state).map(path(['height']))

export const getTime = state => getLatestBlock(state).map(path(['time']))

export const getHash = state => getLatestBlock(state).map(path(['hash']))

export const getIndex = state => getLatestBlock(state).map(path(['block_index']))

export const getSelection = path([dataPath, 'bch', 'payment', 'selection'])

export const getEffectiveBalance = path([dataPath, 'bch', 'payment', 'effectiveBalance'])
