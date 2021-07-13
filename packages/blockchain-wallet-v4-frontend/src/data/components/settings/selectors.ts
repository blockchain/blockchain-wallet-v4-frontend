import { RootState } from 'data/rootReducer'

export const getProductsEligibility = (state: RootState) =>
  state.components.settings.productsEligibility
