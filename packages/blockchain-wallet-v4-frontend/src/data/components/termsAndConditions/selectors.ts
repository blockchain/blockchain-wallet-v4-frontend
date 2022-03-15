import { RootState } from 'data/rootReducer'

export const getTermsAndConditions = (state: RootState) =>
  state.components.termsAndConditions.termsAndConditions
