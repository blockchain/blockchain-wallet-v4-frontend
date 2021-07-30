import * as AT from './actionTypes'
import { CoinTransactionsActionTypes } from './types'

export const initialized = (coin: string): CoinTransactionsActionTypes => ({
  payload: { coin },
  type: AT.TRANSACTIONS_INITIALIZED
})

export const loadMore = (coin: string): CoinTransactionsActionTypes => ({
  payload: {
    coin
  },
  type: AT.COIN_TRANSACTIONS_LOAD_MORE
})
