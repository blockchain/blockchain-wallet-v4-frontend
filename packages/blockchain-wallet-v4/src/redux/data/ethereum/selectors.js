import { path } from 'ramda'

export const getEtherBalance = path(['info', 'final_balance'])

export const getEthereumAddresses = path(['addresses'])

export const getEthRates = path(['rates'])

export const getEthRate = currencyCode => path(['rates', currencyCode])

export const getEthereumTransactions = path(['transactions'])
