import { RootState } from 'data/rootReducer'

export const getWalletTransactions = (state: RootState) =>
  state.dataPath.dot.transactions
