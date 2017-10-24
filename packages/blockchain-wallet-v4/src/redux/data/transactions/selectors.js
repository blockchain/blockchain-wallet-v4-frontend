import { path } from 'ramda'

export const getBitcoinTransactions = path(['transactions', 'bitcoin', 'list'])

export const getBitcoinAddress = path(['transactions', 'bitcoin', 'address'])

export const getEthereumTransactions = path(['transactions', 'ethereum', 'list'])

export const getEthereumAddress = path(['transactions', 'ethereum', 'address'])
