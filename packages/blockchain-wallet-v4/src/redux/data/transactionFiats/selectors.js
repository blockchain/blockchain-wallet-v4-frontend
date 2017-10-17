import { curry, path } from 'ramda'

export const getTransactionFiatAtTime = curry((state, coin, hash, currency) => path(['txs_fiat', coin, hash, currency], state))
