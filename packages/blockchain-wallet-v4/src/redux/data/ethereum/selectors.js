import { path } from 'ramda'

export const getBalance = path(['ethereum', 'info', 'final_balance'])

export const getFee = path(['ethereum', 'fee'])

export const getFeeRegular = path(['ethereum', 'fee', 'regular'])

export const getFeePriority = path(['ethereum', 'fee', 'priority'])

export const getGasLimit = path(['ethereum', 'fee', 'gasLimit'])

export const getAddresses = path(['ethereum', 'addresses'])

export const getRates = path(['ethereum', 'rates'])

export const getRate = currencyCode => path(['ethereum', 'rates', currencyCode])

export const getTransactions = path(['ethereum', 'transactions'])

export const getTransactionsByAccount = account => path(['ethereum', 'transactions', account])
