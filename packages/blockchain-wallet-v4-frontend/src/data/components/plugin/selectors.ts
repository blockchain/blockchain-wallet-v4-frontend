import { RootState } from 'data/rootReducer'

export const getPublicAddress = (state: RootState) => state.components.plugin.publicAddress
export const getTransactionRequest = (state: RootState) =>
  state.components.plugin.transactionRequest
export const getWallet = (state: RootState) => state.components.plugin.wallet
