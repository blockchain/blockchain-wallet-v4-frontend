import { path } from 'ramda'

export const getBitcoinBalance = path(['info', 'bitcoin', 'final_balance'])
export const getNumberTransactions = path(['info', 'bitcoin', 'n_tx'])

export const getEtherBalance = path(['info', 'ethereum', 'final_balance'])
