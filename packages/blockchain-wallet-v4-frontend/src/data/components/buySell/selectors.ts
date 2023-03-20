import BigNumber from 'bignumber.js'
import { head, isEmpty, isNil, lift } from 'ramda'
import { createSelector } from 'reselect'

import {
  BSPaymentMethodType,
  BSPaymentTypes,
  BSQuoteType,
  ExtractSuccess,
  FiatType,
  FiatTypeEnum
} from '@core/types'
import { getBankTransferAccounts } from 'data/components/brokerage/selectors'
import { getFormValues } from 'data/form/selectors'
import { components } from 'data/model'
import { RootState } from 'data/rootReducer'

import { IncomingAmount } from '../swap/types'
import { LIMIT } from './model'
import { BSCardStateEnum, BSCheckoutFormValuesType } from './types'

const { FORM_BS_CHECKOUT } = components.buySell

const hasEligibleFiatCurrency = (currency) =>
  currency === FiatTypeEnum.USD || currency === FiatTypeEnum.GBP || currency === FiatTypeEnum.EUR

export const getAddBank = (state: RootState) => state.components.buySell.addBank

export const getApplePayInfo = (state: RootState) => state.components.buySell.applePayInfo

export const getGooglePayInfo = (state: RootState) => state.components.buySell.googlePayInfo

export const getOrderType = (state: RootState) => state.components.buySell.orderType

export const getBSAccount = (state: RootState) => state.components.buySell.account

export const getCryptoCurrency = (state: RootState) => state.components.buySell.cryptoCurrency

export const getDisplayBack = (state: RootState) => state.components.buySell.displayBack

export const getFiatCurrency = (state: RootState) => state.components.buySell.fiatCurrency

export const getBSOrders = (state: RootState) => state.components.buySell.orders

export const getOrigin = (state: RootState) => state.components.buySell.origin

export const getBSPaymentMethods = (state: RootState) => state.components.buySell.methods

export const getBSBalances = (state: RootState) => state.components.buySell.balances

export const getBSCards = (state: RootState) => state.components.buySell.cards

export const getCrossBorderLimits = (state: RootState) => state.components.buySell.crossBorderLimits

export const getCardTokenId = (state: RootState) => state.components.buySell.cardTokenId

export const getVgsVaultId = (state: RootState) => state.components.buySell.vgsVaultId

export const getCvvStatus = (state: RootState) => state.components.buySell.cvvStatus

export const getDefaultPaymentMethod = createSelector(
  [
    getOrderType,
    getFiatCurrency,
    getBSOrders,
    getBSPaymentMethods,
    getBSBalances,
    getBankTransferAccounts,
    getBSCards
  ],
  (actionType, fiatCurrency, ordersR, sbMethodsR, sbBalancesR, bankAccountsR, cardsR) => {
    const transform = (
      sbMethods: ExtractSuccess<typeof sbMethodsR>,
      sbBalances: ExtractSuccess<typeof sbBalancesR>,
      orders: ExtractSuccess<typeof ordersR>,
      bankAccounts: ExtractSuccess<typeof bankAccountsR>,
      cards: ExtractSuccess<typeof cardsR>
    ): BSPaymentMethodType | undefined => {
      const lastOrder = orders.find((order) => {
        if (actionType === 'BUY') {
          return order.inputCurrency in FiatTypeEnum
        }
        return order.outputCurrency in FiatTypeEnum
      })

      if (actionType === 'SELL') {
        let fiatCurrencyToUse = fiatCurrency
        if (!hasEligibleFiatCurrency(fiatCurrencyToUse)) {
          const currenciesToUse = [FiatTypeEnum.USD, FiatTypeEnum.GBP, FiatTypeEnum.EUR]
          const balancesToUse = Object.keys(sbBalances)
            .filter((key) => currenciesToUse.indexOf(FiatTypeEnum[key]) >= 0)
            .reduce((acc, key) => {
              acc[key] = sbBalances[key]
              return acc
            }, {})
          if (!isEmpty(balancesToUse)) {
            fiatCurrencyToUse = Object.keys(balancesToUse).reduce((a, b) =>
              balancesToUse[a].available > balancesToUse[b].available ? a : b
            ) as FiatType
          }
        }

        return sbMethods.methods.find(
          (method) => method.type === BSPaymentTypes.FUNDS && method.currency === fiatCurrencyToUse
        )
      }

      if (!lastOrder) return undefined

      const methodsOfType = sbMethods.methods.filter(
        (method) => method.type === lastOrder.paymentType
      )
      const method = head(methodsOfType)

      switch (lastOrder.paymentType) {
        case BSPaymentTypes.PAYMENT_CARD:
          if (!method) return
          let card = cards.find(
            (value) =>
              value.id === lastOrder.paymentMethodId && value.state === BSCardStateEnum.ACTIVE
          )

          if (!card) {
            const randomActiveCard = cards.find((value) => value.state === BSCardStateEnum.ACTIVE)

            card = randomActiveCard

            if (!card) return undefined
          }

          return {
            ...method,
            ...card,
            card: card?.card || undefined,
            type: BSPaymentTypes.USER_CARD
          }
        case BSPaymentTypes.FUNDS:
          return methodsOfType.find((method) => {
            return (
              method.currency === lastOrder.inputCurrency &&
              method.currency === fiatCurrency &&
              (sbBalances[method?.currency]?.available || 0) > 0
            )
          })
        case BSPaymentTypes.LINK_BANK:
        case BSPaymentTypes.BANK_TRANSFER:
          if (!method) return
          const bankAccount = bankAccounts.find((acct) => acct.id === lastOrder.paymentMethodId)
          if (bankAccount && bankAccount.state === 'ACTIVE') {
            // TODO BE is inconsistent in such if they fix it we can update it here
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { capabilities, ...bankAccountRest } = bankAccount
            return {
              ...method,
              ...bankAccountRest,
              state: 'ACTIVE',
              type: lastOrder.paymentType as BSPaymentTypes
            }
          }
          return undefined
        default:
          break
      }
    }

    return lift(transform)(sbMethodsR, sbBalancesR, ordersR, bankAccountsR, cardsR)
  }
)

export const hasFiatBalances = (state: RootState) => {
  const fiatBalances = Object.keys(state.components.buySell.balances.data).filter(
    (currency) =>
      currency in FiatTypeEnum &&
      (state.components.buySell.balances.data[currency]?.available || 0) > 0
  )
  return fiatBalances.length > 0
}

export const getBSCard = (state: RootState) => state.components.buySell.card

export const getBSCardId = (state: RootState) => state.components.buySell.cardId

export const getBSFiatEligible = (state: RootState) => state.components.buySell.fiatEligible

export const getBSQuote = (state: RootState) => state.components.buySell.quote
export const hasQuote = createSelector(getBSQuote, (quoteR) => {
  const quote = quoteR.getOrElse({} as BSQuoteType)
  return !isNil(quote.rate)
})

export const getBSPairs = (state: RootState) => state.components.buySell.pairs

export const getBSPair = (state: RootState) => state.components.buySell.pair

export const getBSPaymentMethod = (state: RootState) => state.components.buySell.method

export const getBSMobilePaymentMethod = (state: RootState) =>
  state.components.buySell.mobilePaymentMethod

export const getBSProviderDetails = (state: RootState) => state.components.buySell.providerDetails

export const getBSOrder = (state: RootState) => state.components.buySell.order

export const getBSPendingOrder = (state: RootState) => state.components.buySell.pendingOrder

export const getBSLatestPendingOrder = (state: RootState) =>
  state.components.buySell.orders.getOrElse([]).find((order) => {
    return order.state === 'PENDING_CONFIRMATION' || order.state === 'PENDING_DEPOSIT'
  })

export const getCancelableOrder = createSelector(getBSOrders, (ordersR) => {
  const orders = ordersR.getOrElse([])
  return orders.find((order) => order.state === 'PENDING_CONFIRMATION')
})

export const getVgsAddCardInfo = createSelector(
  getCardTokenId,
  getVgsVaultId,
  (cardTokenId, vgsVaultId) => ({ cardTokenId, vgsVaultId })
)

export const getBuyQuote = (state: RootState) => state.components.buySell.buyQuote

export const getSellQuote = (state: RootState) => state.components.buySell.sellQuote

export const getSellQuotePrice = (state: RootState) => state.components.buySell.sellQuotePrice

export const getSellOrder = (state: RootState) => state.components.buySell.sellOrder

export const getReason = (state: RootState) => state.components.buySell.reason

export const getStep = (state: RootState) => state.components.buySell.step

export const getSwapAccount = (state: RootState) => state.components.buySell.swapAccount

export const getOriginalFiatCurrency = (state: RootState) =>
  state.components.buySell.originalFiatCurrency

export const getPayment = (state: RootState) => state.components.buySell.payment

export const getIncomingAmount = (state: RootState) => {
  return getSellQuote(state).map((quote): IncomingAmount => {
    const amt = quote.quote.resultAmount
    const isNegative = new BigNumber(amt).isLessThanOrEqualTo(0)

    return {
      amt: isNegative ? 0 : amt,
      isNegative
    }
  })
}

export const getMethodByType = (state: RootState, type: BSPaymentTypes) => {
  const sbMethodsR = getBSPaymentMethods(state)
  return lift((sbMethods: ExtractSuccess<typeof sbMethodsR>) => {
    const paymentMethod = sbMethods.methods.find((method) => method.type === type)
    return paymentMethod
  })(sbMethodsR)
}

export const getUserLimit = (state: RootState, type: BSPaymentTypes) => {
  const sbMethodsR = getBSPaymentMethods(state)
  return lift((sbMethods: ExtractSuccess<typeof sbMethodsR>) => {
    const paymentMethod = sbMethods.methods.find((method) => method.type === type)
    return paymentMethod?.limits || LIMIT
  })(sbMethodsR)
}

export const getLimits = (state: RootState) => state.components.buySell.limits

export const getCheckoutAccountCodes = (state: RootState) =>
  state.components.buySell.checkoutDotComAccountCodes

export const getCheckoutApiKey = (state: RootState) => state.components.buySell.checkoutDotComApiKey

export const getAccumulatedTrades = (state: RootState) => state.components.buySell.accumulatedTrades

export const getCardSuccessRate = (state: RootState) => state.components.buySell.cardSuccessRate

export const getBsCheckoutFormValues = (state: RootState) =>
  getFormValues(FORM_BS_CHECKOUT)(state) as BSCheckoutFormValuesType
