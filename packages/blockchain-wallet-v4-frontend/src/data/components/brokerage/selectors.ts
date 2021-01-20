import { RootState } from 'data/rootReducer'

export const getBankTransferAccounts = (state: RootState) =>
  state.components.brokerage.bankTransferAccounts

export const getFastLink = (state: RootState) =>
  state.components.brokerage.fastLink

export const getStep = (state: RootState) => state.components.brokerage.step
export const getAccount = (state: RootState) =>
  state.components.brokerage.account
export const getRedirectBackToStep = (state: RootState) =>
  state.components.brokerage.redirectBackToStep
