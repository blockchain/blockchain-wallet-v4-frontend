import { RootState } from 'data/rootReducer'

export const getBankTransferAccounts = (state: RootState) =>
  state.components.brokerage.bankTransferAccounts

export const getFastLink = (state: RootState) =>
  state.components.brokerage.fastLink
