import { isEmpty } from 'ramda'

import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

export const getProducts = (state: RootState) => state.components.debitCard.products

export const getCardCreationData = (state: RootState) => state.components.debitCard.cardCreationData

export const isDebitCardModuleEnabledForAccount = (state: RootState): boolean => {
  return (
    (selectors.core.walletOptions.getWalletDebitCardEnabled(state).getOrElse(false) as boolean) &&
    !isEmpty(getProducts(state))
  )
}
