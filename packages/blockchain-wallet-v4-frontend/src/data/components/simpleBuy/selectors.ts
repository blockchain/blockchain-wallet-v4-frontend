import { RootState } from 'data/rootReducer'

export const getEverypay3DSDetails = (state: RootState) =>
  state.components.simpleBuy.everypay3DS

export const getSBAccount = (state: RootState) =>
  state.components.simpleBuy.account

export const getCryptoCurrency = (state: RootState) =>
  state.components.simpleBuy.cryptoCurrency

export const getFiatCurrency = (state: RootState) =>
  state.components.simpleBuy.fiatCurrency || state.preferences.sbFiatCurrency

export const getDefaultMethod = (state: RootState) =>
  state.components.simpleBuy.defaultMethod

export const getSBBalances = (state: RootState) =>
  state.components.simpleBuy.balances

export const getSBCard = (state: RootState) => state.components.simpleBuy.card

export const getSBCardId = (state: RootState) =>
  state.components.simpleBuy.cardId

export const getSBCards = (state: RootState) => state.components.simpleBuy.cards

export const getSBFiatEligible = (state: RootState) =>
  state.components.simpleBuy.fiatEligible

export const getSBQuote = (state: RootState) => state.components.simpleBuy.quote

export const getSBPairs = (state: RootState) => state.components.simpleBuy.pairs

export const getSBPaymentMethods = (state: RootState) =>
  state.components.simpleBuy.methods

export const getSBProviderDetails = (state: RootState) =>
  state.components.simpleBuy.providerDetails

export const getSBOrder = (state: RootState) => state.components.simpleBuy.order

export const getSBOrders = (state: RootState) =>
  state.components.simpleBuy.orders

export const getSBLatestPendingOrder = (state: RootState) =>
  state.components.simpleBuy.orders.getOrElse([]).find(order => {
    return (
      order.state === 'PENDING_CONFIRMATION' ||
      order.state === 'PENDING_DEPOSIT' ||
      order.state === 'DEPOSIT_MATCHED'
    )
  })

export const getSBSuggestedAmounts = (state: RootState) =>
  state.components.simpleBuy.suggestedAmounts

export const getStep = (state: RootState) => state.components.simpleBuy.step
