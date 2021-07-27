import * as AT from './actionTypes'

// actions
interface CoinTransactionsInitializedActionType {
  payload: {
    coin: string
  }
  type: typeof AT.TRANSACTIONS_INITIALIZED
}
interface CoinTransactionsLoadMoreActionType {
  payload: {
    coin: string
  }
  type: typeof AT.COIN_TRANSACTIONS_LOAD_MORE
}

export type CoinTransactionsActionTypes =
  | CoinTransactionsInitializedActionType
  | CoinTransactionsLoadMoreActionType
