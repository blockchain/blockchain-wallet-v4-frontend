import { isEmpty } from 'ramda'

import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

export const getProducts = (state: RootState) => state.components.debitCard.products

export const getCardCreationData = (state: RootState) => state.components.debitCard.cardCreationData

export const isDebitCardModuleEnabledForAccount = (state: RootState): boolean => {
  // If feature flag is disabled then it will only be the initial state in products
  return !isEmpty(getProducts(state))
}
