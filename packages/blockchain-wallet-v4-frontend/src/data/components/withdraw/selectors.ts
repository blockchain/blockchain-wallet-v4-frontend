import { RootState } from 'data/rootReducer'

export const getAmount = (state: RootState) => state.components.withdraw.amount

export const getBeneficiary = (state: RootState) =>
  state.components.withdraw.beneficiary

export const getFiatCurrency = (state: RootState) =>
  state.components.withdraw.fiatCurrency

export const getStep = (state: RootState) => state.components.withdraw.step
