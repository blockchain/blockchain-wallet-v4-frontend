import { RootState } from 'data/rootReducer'

export const getWalletTransactions = (state: RootState, coin: string) =>
  state.dataPath.coins.transactions[coin]
