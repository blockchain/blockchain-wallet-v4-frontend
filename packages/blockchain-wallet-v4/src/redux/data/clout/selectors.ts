import { RootState } from 'data/rootReducer'

export const getRates = (state: RootState) => {
  return state.dataPath.clout.rates
}

export const getTransactions = (state: RootState) => {
  return state.dataPath.clout.transactions
}

export const getTransactionsAtBound = (state: RootState) => {
  return state.dataPath.clout.transactions_at_bound
}
