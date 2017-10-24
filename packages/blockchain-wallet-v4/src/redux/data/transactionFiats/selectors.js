import { curry, path } from 'ramda'

export const getTransactionFiatAtTime = curry((state, coin, hash, currency) => path(['transactions_fiat', coin, hash, currency], state))
