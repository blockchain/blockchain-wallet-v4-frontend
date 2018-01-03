import { path } from 'ramda'
import { dataPath } from '../../paths'
import * as RemoteData from '../../remoteData'

export const getAddresses = path([dataPath, 'bitcoin', 'addresses'])

export const getFee = path([dataPath, 'bitcoin', 'fee'])

export const getInfo = path([dataPath, 'bitcoin', 'info'])

export const getLatestBlock = path([dataPath, 'bitcoin', 'latest_block'])

export const getRates = path([dataPath, 'bitcoin', 'rates'])

export const getTransactions = path([dataPath, 'bitcoin', 'transactions'])

// Specific
export const getChangeIndex = state => RemoteData.map(x => path(['xpub', 'change_index'], x), getAddresses(state))

export const getReceiveIndex = state => RemoteData.map(x => path(['xpub', 'account_index'], x), getAddresses(state))

export const getFeeRegular = state => RemoteData.map(x => path(['regular'], x), getFee(state))

export const getFeePriority = state => RemoteData.map(x => path(['priority'], x), getFee(state))

export const getBalance = state => RemoteData.map(x => path(['final_balance'], x), getInfo(state))

export const getNumberTransactions = state => RemoteData.map(x => path(['n_tx'], x), getInfo(state))

export const getHeight = state => RemoteData.map(x => path(['height'], x), getLatestBlock(state))

export const getTime = state => RemoteData.map(x => path(['time'], x), getLatestBlock(state))

export const getHash = state => RemoteData.map(x => path(['hash'], x), getLatestBlock(state))

export const getIndex = state => RemoteData.map(x => path(['block_index'], x), getLatestBlock(state))

// export const getCoins = path([dataPath, 'bitcoin', 'payment', 'coins'])

// export const getSelection = path([dataPath, 'bitcoin', 'payment', 'selection'])

// export const getEffectiveBalance = path([dataPath, 'bitcoin', 'payment', 'effectiveBalance'])

// export const getTransactionFiatAtTime = curry((state, hash, currency) => path([dataPath, 'bitcoin', 'transactions_fiat', hash, currency], state))
