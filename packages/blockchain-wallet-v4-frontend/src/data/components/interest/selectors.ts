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

export const getInterestAccount = (state: RootState) =>
  state.components.interest.account

export const getStep = (state: RootState) => state.components.interest.step

export const getInterestRate = (state: RootState) =>
  state.components.interest.interestRate

export const getInterestTransactions = (state: RootState) =>
  state.components.interest.interestTransactions

export const getDepositAddress = (state: RootState) => {
  const account = getInterestAccount(state).getOrElse({ accountRef: null })
  // @ts-ignore TODO: fixme
  return account.accountRef
}
