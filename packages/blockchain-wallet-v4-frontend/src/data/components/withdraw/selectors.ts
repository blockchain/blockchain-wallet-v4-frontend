import { RootState } from 'data/rootReducer'

export const getFiatCurrency = (state: RootState) =>
  state.components.withdraw.fiatCurrency

export const getStep = (state: RootState) => state.components.withdraw.step
