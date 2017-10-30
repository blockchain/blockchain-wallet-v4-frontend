import { path, curry } from 'ramda'

export const getBitcoinAddresses = path(['addresses'])

export const getChangeIndex = curry((xpub, data) => path(['addresses', xpub, 'change_index'], data))

export const getReceiveIndex = curry((xpub, data) => path(['addresses', xpub, 'account_index'], data))

export const getBitcoinBalance = path(['info', 'final_balance'])

export const getNumberTransactions = path(['info', 'n_tx'])

export const getFee = path(['fee'])

export const getRegular = path(['fee', 'regular'])

export const getPriority = path(['fee', 'priority'])

export const getHeight = path(['latest_block', 'height'])

export const getTime = path(['latest_block', 'time'])

export const getHash = path(['latest_block', 'hash'])

export const getIndex = path(['latest_block', 'block_index'])

export const getCoins = path(['payment', 'coins'])

export const getSelection = path(['payment', 'selection'])

export const getEffectiveBalance = path(['payment', 'effectiveBalance'])

export const getBtcRates = path(['rates'])

export const getBtcRate = currencyCode => path(['rates', currencyCode])

export const getTransactionFiatAtTime = curry((state, hash, currency) => path(['transactions_fiat', hash, currency], state))

export const getBitcoinTransactions = path(['transactions', 'list'])

export const getBitcoinAddress = path(['transactions', 'address'])
