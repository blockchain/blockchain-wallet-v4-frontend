import { RootState } from 'data/rootReducer'

export const getTransactions = (state: RootState) => {
  return state.dataPath.algo.transactions
}
