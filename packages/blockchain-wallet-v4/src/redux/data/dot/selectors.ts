import { RootState } from 'data/rootReducer'

export const getRates = (state: RootState) => {
  return state.dataPath.dot.rates
}

export const getTransactions = (state: RootState) => {
  return state.dataPath.dot.transactions
}

export const getTransactionsAtBound = (state: RootState) => {
  return state.dataPath.dot.transactions_at_bound
}
