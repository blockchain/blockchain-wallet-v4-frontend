import { RootState } from 'data/rootReducer'

export const getFiatCurrency = (state: RootState) =>
  state.components.simpleBuy.fiatCurrency

export const getSBFiatEligible = (state: RootState) =>
  state.components.simpleBuy.fiatEligible

export const getSBPairs = (state: RootState) => state.components.simpleBuy.pairs

export const getSBSuggestedAmounts = (state: RootState) =>
  state.components.simpleBuy.suggestedAmounts

export const getStep = (state: RootState) => state.components.simpleBuy.step
