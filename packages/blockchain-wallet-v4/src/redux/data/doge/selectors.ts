import { RootState } from 'data/rootReducer'

export const getRates = (state: RootState) => {
  return state.dataPath.doge.rates
}

export const getTransactions = (state: RootState) => {
  return state.dataPath.doge.transactions
}

export const getTransactionsAtBound = (state: RootState) => {
  return state.dataPath.doge.transactions_at_bound
}
