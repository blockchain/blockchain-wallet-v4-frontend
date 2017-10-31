import { path } from 'ramda'

export const getBalance = path(['ethereum', 'info', 'final_balance'])

export const getAddresses = path(['ethereum', 'addresses'])

export const getRates = path(['ethereum', 'rates'])

export const getRate = currencyCode => path(['ethereum', 'rates', currencyCode])

export const getTransactions = path(['ethereum', 'transactions'])
