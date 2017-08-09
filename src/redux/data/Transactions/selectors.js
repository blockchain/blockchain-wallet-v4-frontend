import { path } from 'ramda'

export const getTransactions = path(['txs', 'list'])
export const getAddress = path(['txs', 'address'])
