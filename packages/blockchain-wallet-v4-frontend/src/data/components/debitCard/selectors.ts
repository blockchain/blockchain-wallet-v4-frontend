import { isEmpty } from 'ramda'

import { RootState } from 'data/rootReducer'

export const getProducts = (state: RootState) => state.components.debitCard.products

export const getCardCreationData = (state: RootState) => state.components.debitCard.cardCreationData

export const isDebitCardModuleEnabledForAccount = (state: RootState): boolean => {
  // If feature flag is disabled then it will only be the initial state in products
  return !isEmpty(getProducts(state))
}

export const getCards = (state: RootState) => state.components.debitCard.cards

export const getCardToken = (state: RootState) => state.components.debitCard.cardToken

export const getLockHandler = (state: RootState) => state.components.debitCard.lockHandler

export const getEligibleAccounts = (state: RootState) => state.components.debitCard.eligibleAccounts

export const getCurrentCardAccount = (state: RootState) =>
  state.components.debitCard.currentCardAccount

export const getCurrentCardSelected = (state: RootState) =>
  state.components.debitCard.currentCardSelected

export const getTerminateCardHandler = (state: RootState) =>
  state.components.debitCard.terminateHandler
