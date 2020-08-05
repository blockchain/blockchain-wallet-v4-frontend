import { ExtractSuccess, SBPaymentMethodType } from 'core/types'
import { head, lift } from 'ramda'
import { RootState } from 'data/rootReducer'

export const getActionType = (state: RootState) =>
  state.components.simpleBuy.actionType

export const getEverypay3DSDetails = (state: RootState) =>
  state.components.simpleBuy.everypay3DS

export const getSBAccount = (state: RootState) =>
  state.components.simpleBuy.account

export const getCryptoCurrency = (state: RootState) =>
  state.components.simpleBuy.cryptoCurrency

export const getDisplayBack = (state: RootState) =>
  state.components.simpleBuy.displayBack

export const getFiatCurrency = (state: RootState) =>
  state.components.simpleBuy.fiatCurrency || state.preferences.sbFiatCurrency

export const getDefaultPaymentMethod = (state: RootState) => {
  const fiatCurrency = getFiatCurrency(state)
  const ordersR = getSBOrders(state)
  const sbCardsR = getSBCards(state)
  const sbMethodsR = getSBPaymentMethods(state)
  const actionType = getActionType(state)

  const transform = (
    orders: ExtractSuccess<typeof ordersR>,
    sbCards: ExtractSuccess<typeof sbCardsR>,
    sbMethods: ExtractSuccess<typeof sbMethodsR>
  ): SBPaymentMethodType | undefined => {
    const lastOrder = head(orders)
    if (!lastOrder) return undefined

    const methodsOfType = sbMethods.methods.filter(
      method => method.type === lastOrder.paymentType
    )

    switch (actionType) {
      case 'SELL':
        return sbMethods.methods.find(
          method => method.type === 'FUNDS' && method.currency === fiatCurrency
        )
      default:
        switch (lastOrder.paymentType) {
          case 'PAYMENT_CARD':
            const method = head(methodsOfType)
            if (!method) return
            const sbCard = sbCards.find(
              value => value.id === lastOrder.paymentMethodId
            )
            const card = sbCard?.card || undefined

            return {
              ...method,
              ...sbCard,
              type: 'USER_CARD',
              card
            }
          case 'FUNDS':
            return methodsOfType.find(
              method =>
                method.currency === lastOrder.inputCurrency &&
                method.currency === fiatCurrency
            )
          case 'BANK_ACCOUNT':
          case 'USER_CARD':
          case undefined:
            return undefined
        }
        break
    }
  }

  return lift(transform)(ordersR, sbCardsR, sbMethodsR)
}

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

export const getSBPair = (state: RootState) => state.components.simpleBuy.pair

export const getSBPaymentMethod = (state: RootState) =>
  state.components.simpleBuy.method

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
