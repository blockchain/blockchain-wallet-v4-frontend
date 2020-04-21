import { RootState } from '../../rootReducer'

export const getCoinType = (state: RootState) => state.components.interest.coin

export const getInterestEligible = (state: RootState) =>
  state.components.interest.interestEligible

export const getInterestInstruments = (state: RootState) =>
  state.components.interest.interestInstruments

export const getInterestLimits = (state: RootState) =>
  state.components.interest.interestLimits

export const getInterestPaymentAccount = (state: RootState) =>
  state.components.interest.account

export const getModalName = (state: RootState) =>
  state.components.interest.modalName
