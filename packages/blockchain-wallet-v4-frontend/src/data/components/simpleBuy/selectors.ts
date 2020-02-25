import { RootState } from 'data/rootReducer'

export const getSBFiatEligible = (state: RootState) =>
  state.components.simpleBuy.fiatEligible

export const getSBPairs = (state: RootState) => state.components.simpleBuy.pairs
