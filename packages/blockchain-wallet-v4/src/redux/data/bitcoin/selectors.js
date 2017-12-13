import { path, curry } from 'ramda'
import { dataPath } from '../../paths'

export const getAddresses = path([dataPath, 'bitcoin', 'addresses'])

export const getChangeIndex = curry((xpub, data) => path([dataPath, 'bitcoin', 'addresses', xpub, 'change_index'], data))

export const getReceiveIndex = curry((xpub, data) => path([dataPath, 'bitcoin', 'addresses', xpub, 'account_index'], data))

export const getBalance = path([dataPath, 'bitcoin', 'info', 'final_balance'])

export const getNumberTransactions = path([dataPath, 'bitcoin', 'info', 'n_tx'])

export const getFee = path([dataPath, 'bitcoin', 'fee'])

export const getFeeRegular = path([dataPath, 'bitcoin', 'fee', 'regular'])

export const getFeePriority = path([dataPath, 'bitcoin', 'fee', 'priority'])

export const getHeight = path([dataPath, 'bitcoin', 'latest_block', 'height'])

export const getTime = path([dataPath, 'bitcoin', 'latest_block', 'time'])

export const getHash = path([dataPath, 'bitcoin', 'latest_block', 'hash'])

export const getIndex = path([dataPath, 'bitcoin', 'latest_block', 'block_index'])

export const getCoins = path([dataPath, 'bitcoin', 'payment', 'coins'])

export const getSelection = path([dataPath, 'bitcoin', 'payment', 'selection'])

export const getEffectiveBalance = path([dataPath, 'bitcoin', 'payment', 'effectiveBalance'])

export const getRates = path([dataPath, 'bitcoin', 'rates'])

export const getRate = currencyCode => path([dataPath, 'bitcoin', 'rates', currencyCode])

export const getTransactionFiatAtTime = curry((state, hash, currency) => path([dataPath, 'bitcoin', 'transactions_fiat', hash, currency], state))

export const getTransactions = path([dataPath, 'bitcoin', 'transactions', 'list'])

export const getAddress = path([dataPath, 'bitcoin', 'transactions', 'address'])

