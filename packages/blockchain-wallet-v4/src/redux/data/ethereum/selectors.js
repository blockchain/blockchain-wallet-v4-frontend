import { path } from 'ramda'

export const getEtherBalance = path(['ethereum', 'info', 'final_balance'])

export const getEthereumAddresses = path(['ethereum', 'addresses'])

export const getEthRates = path(['ethereum', 'rates'])

export const getEthRate = currencyCode => path(['ethereum', 'rates', currencyCode])

export const getEthereumTransactions = path(['ethereum', 'transactions'])
