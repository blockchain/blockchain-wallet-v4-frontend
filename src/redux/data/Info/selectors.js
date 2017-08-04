import { path } from 'ramda'

export const getBalance = path(['info', 'final_balance'])
export const getNumberTransactions = path(['info', 'n_tx'])
