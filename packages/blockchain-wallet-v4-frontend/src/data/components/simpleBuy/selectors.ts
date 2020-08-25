import {
  ExtractSuccess,
  FiatTypeEnum,
  SBPaymentMethodType
} from 'blockchain-wallet-v4/src/types'
import { head, lift } from 'ramda'
import { RootState } from 'data/rootReducer'

export const getOrderType = (state: RootState) =>
  state.components.simpleBuy.orderType

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
  const orders = getSBOrders(state).getOrElse([])
  const sbCardsR = getSBCards(state)
  const sbMethodsR = getSBPaymentMethods(state)
  const actionType = getOrderType(state)

  const transform = (
    sbCards: ExtractSuccess<typeof sbCardsR>,
    sbMethods: ExtractSuccess<typeof sbMethodsR>
  ): SBPaymentMethodType | undefined => {
    const lastOrder = orders.find(order => {
      if (actionType === 'BUY') {
        return order.inputCurrency in FiatTypeEnum
      } else {
        return order.outputCurrency in FiatTypeEnum
      }
    })

    switch (actionType) {
      case 'SELL':
        return sbMethods.methods.find(
          method =>
            method.type === 'FUNDS' &&
            method.currency === fiatCurrency &&
            // TODO: simple buy USD
            method.currency !== 'USD'
        )
      default:
        if (!lastOrder) return undefined

        const methodsOfType = sbMethods.methods.filter(
          method => method.type === lastOrder.paymentType
        )

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

  return lift(transform)(sbCardsR, sbMethodsR)
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

export const getStep = (state: RootState) => state.components.simpleBuy.step
