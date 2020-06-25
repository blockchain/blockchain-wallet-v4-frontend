import { RootState } from 'data/rootReducer'

export const getRates = (state: RootState) => {
  return state.dataPath.algo.rates
}

export const getTransactions = (state: RootState) => {
  return state.dataPath.algo.transactions
}

export const getTransactionsAtBound = (state: RootState) => {
  return state.dataPath.algo.transactions_at_bound
}
