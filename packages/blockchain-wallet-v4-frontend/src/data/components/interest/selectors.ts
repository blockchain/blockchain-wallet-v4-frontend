import { RootState } from '../../rootReducer'

export const getInterestAccountBalance = (state: RootState) =>
  state.components.interest.interestAccountBalance

export const getCoinType = (state: RootState) => state.components.interest.coin

export const getInterestEligible = (state: RootState) =>
  state.components.interest.interestEligible

export const getInterestInstruments = (state: RootState) =>
  state.components.interest.interestInstruments

export const getInterestLimits = (state: RootState) =>
  state.components.interest.interestLimits

export const getInterestPaymentAccount = (state: RootState) =>
  state.components.interest.account

export const getInterestRate = (state: RootState) =>
  state.components.interest.interestRate

export const getInterestTransactions = (state: RootState) =>
  state.components.interest.interestTransactions
