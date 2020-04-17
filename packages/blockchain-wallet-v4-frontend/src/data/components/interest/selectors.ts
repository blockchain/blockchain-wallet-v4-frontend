import { RootState } from '../../rootReducer'

export const getCoinType = (state: RootState) => state.components.interest.coin

export const getInterestEligible = (state: RootState) =>
  state.components.interest.interestEligible

export const getInterestLimits = (state: RootState) =>
  state.components.interest.interestLimits
