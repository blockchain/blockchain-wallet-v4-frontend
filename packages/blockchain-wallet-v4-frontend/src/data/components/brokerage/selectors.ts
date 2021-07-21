import { RootState } from 'data/rootReducer'

export const getBankCredentials = (state: RootState) => state.components.brokerage.bankCredentials

export const getBankTransferAccounts = (state: RootState) =>
  state.components.brokerage.bankTransferAccounts

export const getFastLink = (state: RootState) => state.components.brokerage.fastLink

export const getAddBankStep = (state: RootState) => state.components.brokerage.addBankStep

export const getDWStep = (state: RootState) => state.components.brokerage.dwStep

export const getAccount = (state: RootState) => state.components.brokerage.account

export const getRedirectBackToStep = (state: RootState) =>
  state.components.brokerage.redirectBackToStep

export const getAddBankStatus = (state: RootState) => state.components.brokerage.bankStatus

export const getFiatCurrency = (state: RootState) => state.components.brokerage.fiatCurrency

export const getIsFlow = (state: RootState) => state.components.brokerage.isFlow
