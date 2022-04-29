import { RootState } from 'data/rootReducer'

export const getProducts = (state: RootState) => state.components.debitCard.products

export const getCardCreationData = (state: RootState) => state.components.debitCard.cardCreationData

export const isDebitCardModuleEnabledForAccount = (state: RootState): boolean => {
  // If feature flag is disabled then it will only be the initial state in products
  // return !isEmpty(getProducts(state)) // TODO: quick patch for keeping module working. DO NOT COMMIT TO PROD
  return true
}

export const getCards = (state: RootState) => state.components.debitCard.cards

export const getCardToken = (state: RootState) => state.components.debitCard.cardToken

export const getLockHandler = (state: RootState) => state.components.debitCard.lockHandler
