import BigNumber from 'bignumber.js'
import { getQuote } from 'blockchain-wallet-v4-frontend/src/modals/BuySell/EnterAmount/Checkout/validation'
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
import { model, selectors } from 'data'
import { RootState } from 'data/rootReducer'

import { convertBaseToStandard, convertStandardToBase } from '../exchange/services'
import { getInputFromPair, getOutputFromPair } from '../swap/model'
import { getRate } from '../swap/utils'
import { LIMIT } from './model'
import { BSCardStateEnum, BSCheckoutFormValuesType } from './types'

const { FORM_BS_CHECKOUT } = model.components.buySell

const hasEligibleFiatCurrency = (currency) =>
  currency === FiatTypeEnum.USD || currency === FiatTypeEnum.GBP || currency === FiatTypeEnum.EUR

export const getAddBank = (state: RootState) => state.components.buySell.addBank

export const getAddCardError = (state: RootState) => state.components.buySell.addCardError

export const getApplePayInfo = (state: RootState) => state.components.buySell.applePayInfo

export const getOrderType = (state: RootState) => state.components.buySell.orderType

export const getEverypay3DSDetails = (state: RootState) => state.components.buySell.everypay3DS

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

export const getDefaultPaymentMethod = (state: RootState) => {
  const fiatCurrency = getFiatCurrency(state)
  const orders = getBSOrders(state).getOrElse([])
  const sbMethodsR = getBSPaymentMethods(state)
  const actionType = getOrderType(state)
  const sbBalancesR = getBSBalances(state)
  const bankAccounts = selectors.components.brokerage.getBankTransferAccounts(state).getOrElse([])

  const transform = (
    sbMethods: ExtractSuccess<typeof sbMethodsR>,
    sbBalances: ExtractSuccess<typeof sbBalancesR>
  ): BSPaymentMethodType | undefined => {
    const lastOrder = orders.find((order) => {
      if (actionType === 'BUY') {
        return order.inputCurrency in FiatTypeEnum
      }
      return order.outputCurrency in FiatTypeEnum
    })

    switch (actionType) {
      case 'SELL':
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
      default:
        if (!lastOrder) return undefined

        const methodsOfType = sbMethods.methods.filter(
          (method) => method.type === lastOrder.paymentType
        )
        const method = head(methodsOfType)

        switch (lastOrder.paymentType) {
          case BSPaymentTypes.USER_CARD:
          case BSPaymentTypes.PAYMENT_CARD:
            if (!method) return
            const sbCards = getBSCards(state).getOrElse([])
            const sbCard = sbCards.find(
              (value) =>
                value.id === lastOrder.paymentMethodId && value.state === BSCardStateEnum.ACTIVE
            )
            const card = sbCard?.card || undefined

            if (!card) return undefined

            return {
              ...method,
              ...sbCard,
              card,
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
              return {
                ...method,
                ...bankAccount,
                state: 'ACTIVE',
                type: lastOrder.paymentType as BSPaymentTypes
              }
            }
            return undefined
          case BSPaymentTypes.BANK_ACCOUNT:
          case undefined:
            return undefined
          default:
            break
        }
    }
  }

  return lift(transform)(sbMethodsR, sbBalancesR)
}

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

export const getBSLatestPendingOrder = (state: RootState) =>
  state.components.buySell.orders.getOrElse([]).find((order) => {
    return order.state === 'PENDING_CONFIRMATION' || order.state === 'PENDING_DEPOSIT'
  })

export const getBuyQuote = (state: RootState) => state.components.buySell.buyQuote

export const getSellQuote = (state: RootState) => state.components.buySell.sellQuote

export const getSellOrder = (state: RootState) => state.components.buySell.sellOrder

export const getStep = (state: RootState) => state.components.buySell.step

export const getSwapAccount = (state: RootState) => state.components.buySell.swapAccount

export const getOriginalFiatCurrency = (state: RootState) =>
  state.components.buySell.originalFiatCurrency

// Sell specific (for now!)
// used for sell only now, eventually buy as well
// TODO: use swap2 quote for buy AND sell
export const getPayment = (state: RootState) => state.components.buySell.payment

export const getIncomingAmount = (state: RootState) => {
  const quoteR = getSellQuote(state)
  const values = (selectors.form.getFormValues(FORM_BS_CHECKOUT)(
    state
  ) as BSCheckoutFormValuesType) || { amount: '0', fix: 'CRYPTO' }

  return lift(({ quote, rate }: ExtractSuccess<typeof quoteR>) => {
    const fromCoin = getInputFromPair(quote.pair)
    const toCoin = getOutputFromPair(quote.pair)
    const amount =
      values.fix === 'CRYPTO'
        ? values.amount
        : getQuote(quote.pair, rate, values.fix, values.amount)
    const amtMinor = convertStandardToBase(fromCoin, amount)
    const exRate = new BigNumber(getRate(quote.quote.priceTiers, toCoin, new BigNumber(amtMinor)))
    const feeMajor = convertBaseToStandard(toCoin, quote.networkFee)

    const amt = exRate.times(amount).minus(feeMajor)
    const isNegative = amt.isLessThanOrEqualTo(0)

    return {
      amt: isNegative ? 0 : amt,
      isNegative
    }
  })(quoteR)
}

export const getSddEligible = (state: RootState) => state.components.buySell.sddEligible

export const isUserSddEligible = (state: RootState) => {
  const sddEligibleR = getSddEligible(state)
  return lift((sddEligible: ExtractSuccess<typeof sddEligibleR>) => !sddEligible.eligible)(
    sddEligibleR
  )
}
export const getUserSddEligibleTier = (state: RootState) => {
  const sddEligibleR = getSddEligible(state)
  return lift((sddEligible: ExtractSuccess<typeof sddEligibleR>) => sddEligible.tier)(sddEligibleR)
}

export const getUserLimit = (state: RootState, type: BSPaymentTypes) => {
  const sbMethodsR = getBSPaymentMethods(state)
  return lift((sbMethods: ExtractSuccess<typeof sbMethodsR>) => {
    const paymentMethod = sbMethods.methods.find((method) => method.type === type)
    return paymentMethod?.limits || LIMIT
  })(sbMethodsR)
}

export const getSddVerified = (state: RootState) => state.components.buySell.sddVerified

export const isUserSddVerified = (state: RootState) => {
  const sddVerifiedR = getSddVerified(state)
  return lift(
    (sddVerified: ExtractSuccess<typeof sddVerifiedR>) =>
      sddVerified.taskComplete && sddVerified.verified
  )(sddVerifiedR)
}
export const getLimits = (state: RootState) => state.components.buySell.limits

export const getSddTransactionFinished = (state: RootState) =>
  state.components.buySell.sddTransactionFinished

export const getCheckoutAccountCodes = (state: RootState) =>
  state.components.buySell.checkoutDotComAccountCodes

export const getCheckoutApiKey = (state: RootState) => state.components.buySell.checkoutDotComApiKey

export const getAccumulatedTrades = (state: RootState) => state.components.buySell.accumulatedTrades
