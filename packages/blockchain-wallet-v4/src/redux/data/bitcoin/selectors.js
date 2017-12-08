import { path, curry } from 'ramda'

export const getAddresses = path(['bitcoin', 'addresses'])

export const getChangeIndex = curry((xpub, data) => path(['bitcoin', 'addresses', xpub, 'change_index'], data))

export const getReceiveIndex = curry((xpub, data) => path(['bitcoin', 'addresses', xpub, 'account_index'], data))

export const getBalance = path(['bitcoin', 'info', 'final_balance'])

export const getNumberTransactions = path(['bitcoin', 'info', 'n_tx'])

export const getFee = path(['bitcoin', 'fee'])

export const getFeeRegular = path(['bitcoin', 'fee', 'regular'])

export const getFeePriority = path(['bitcoin', 'fee', 'priority'])

export const getHeight = path(['bitcoin', 'latest_block', 'height'])

export const getTime = path(['bitcoin', 'latest_block', 'time'])

export const getHash = path(['bitcoin', 'latest_block', 'hash'])

export const getIndex = path(['bitcoin', 'latest_block', 'block_index'])

export const getCoins = path(['bitcoin', 'payment', 'coins'])

export const getSelection = path(['bitcoin', 'payment', 'selection'])

export const getEffectiveBalance = path(['bitcoin', 'payment', 'effectiveBalance'])

export const getRates = path(['bitcoin', 'rates'])

export const getRate = currencyCode => path(['bitcoin', 'rates', currencyCode])

export const getFiatAtTime = path(['bitcoin', 'rates'])

export const getTransactionFiatAtTime = curry((state, hash, currency) => path(['bitcoin', 'transactions_fiat', hash, currency], state))

export const getTransactions = path(['bitcoin', 'transactions', 'list'])

export const getAddress = path(['bitcoin', 'transactions', 'address'])
