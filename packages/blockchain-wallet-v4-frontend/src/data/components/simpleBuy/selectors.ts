import BigNumber from 'bignumber.js'
import { getQuote } from 'blockchain-wallet-v4-frontend/src/modals/SimpleBuy/EnterAmount/Checkout/validation'
import { head, isEmpty, isNil, lift } from 'ramda'
import { createSelector } from 'reselect'

import {
  ExtractSuccess,
  FiatType,
  FiatTypeEnum,
  SBPaymentMethodType,
  SBPaymentTypes,
  SBQuoteType
} from 'blockchain-wallet-v4/src/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

import { convertBaseToStandard, convertStandardToBase } from '../exchange/services'
import { getInputFromPair, getOutputFromPair } from '../swap/model'
import { getRate } from '../swap/utils'
import { LIMIT } from './model'
import { SBCardStateEnum, SBCheckoutFormValuesType } from './types'

const hasEligibleFiatCurrency = (currency) =>
  currency === FiatTypeEnum.USD || currency === FiatTypeEnum.GBP || currency === FiatTypeEnum.EUR

export const getAddBank = (state: RootState) => state.components.simpleBuy.addBank

export const getOrderType = (state: RootState) => state.components.simpleBuy.orderType

export const getEverypay3DSDetails = (state: RootState) => state.components.simpleBuy.everypay3DS

export const getSBAccount = (state: RootState) => state.components.simpleBuy.account

export const getCryptoCurrency = (state: RootState) => state.components.simpleBuy.cryptoCurrency

export const getDisplayBack = (state: RootState) => state.components.simpleBuy.displayBack

export const getFiatCurrency = (state: RootState) => state.components.simpleBuy.fiatCurrency

export const getSBOrders = (state: RootState) => state.components.simpleBuy.orders

export const getSBPaymentMethods = (state: RootState) => state.components.simpleBuy.methods

export const getSBBalances = (state: RootState) => state.components.simpleBuy.balances

export const getSBCards = (state: RootState) => state.components.simpleBuy.cards

export const getDefaultPaymentMethod = (state: RootState) => {
  const fiatCurrency = getFiatCurrency(state)
  const orders = getSBOrders(state).getOrElse([])
  const sbMethodsR = getSBPaymentMethods(state)
  const actionType = getOrderType(state)
  const sbBalancesR = getSBBalances(state)
  const bankAccounts = selectors.components.brokerage.getBankTransferAccounts(state).getOrElse([])

  const transform = (
    sbMethods: ExtractSuccess<typeof sbMethodsR>,
    sbBalances: ExtractSuccess<typeof sbBalancesR>
  ): SBPaymentMethodType | undefined => {
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
          (method) => method.type === SBPaymentTypes.FUNDS && method.currency === fiatCurrencyToUse
        )
      default:
        if (!lastOrder) return undefined

        const methodsOfType = sbMethods.methods.filter(
          (method) => method.type === lastOrder.paymentType
        )
        const method = head(methodsOfType)

        switch (lastOrder.paymentType) {
          case SBPaymentTypes.USER_CARD:
          case SBPaymentTypes.PAYMENT_CARD:
            if (!method) return
            const active = SBCardStateEnum.ACTIVE
            const sbCards = getSBCards(state).getOrElse([])
            const sbCard = sbCards.find(
              (value) =>
                value.id === lastOrder.paymentMethodId && value.state === SBCardStateEnum[active]
            )
            const card = sbCard?.card || undefined

            if (!card) return undefined

            return {
              ...method,
              ...sbCard,
              card,
              type: SBPaymentTypes.USER_CARD
            }
          case SBPaymentTypes.FUNDS:
            return methodsOfType.find((method) => {
              return (
                method.currency === lastOrder.inputCurrency &&
                method.currency === fiatCurrency &&
                (sbBalances[method?.currency]?.available || 0) > 0
              )
            })
          case SBPaymentTypes.LINK_BANK:
          case SBPaymentTypes.BANK_TRANSFER:
            if (!method) return
            const bankAccount = bankAccounts.find((acct) => acct.id === lastOrder.paymentMethodId)
            if (bankAccount && bankAccount.state === 'ACTIVE') {
              return {
                ...method,
                ...bankAccount,
                state: 'ACTIVE',
                type: lastOrder.paymentType as SBPaymentTypes
              }
            }
            return undefined
          case SBPaymentTypes.BANK_ACCOUNT:
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
  const fiatBalances = Object.keys(state.components.simpleBuy.balances.data).filter(
    (currency) =>
      currency in FiatTypeEnum &&
      (state.components.simpleBuy.balances.data[currency]?.available || 0) > 0
  )
  return fiatBalances.length > 0
}

export const getSBCard = (state: RootState) => state.components.simpleBuy.card

export const getSBCardId = (state: RootState) => state.components.simpleBuy.cardId

export const getSBFiatEligible = (state: RootState) => state.components.simpleBuy.fiatEligible

export const getSBQuote = (state: RootState) => state.components.simpleBuy.quote
export const hasQuote = createSelector(getSBQuote, (quoteR) => {
  const quote = quoteR.getOrElse({} as SBQuoteType)
  return !isNil(quote.rate)
})

export const getSBPairs = (state: RootState) => state.components.simpleBuy.pairs

export const getSBPair = (state: RootState) => state.components.simpleBuy.pair

export const getSBPaymentMethod = (state: RootState) => state.components.simpleBuy.method

export const getSBProviderDetails = (state: RootState) => state.components.simpleBuy.providerDetails

export const getSBOrder = (state: RootState) => state.components.simpleBuy.order

export const getSBLatestPendingOrder = (state: RootState) =>
  state.components.simpleBuy.orders.getOrElse([]).find((order) => {
    return order.state === 'PENDING_CONFIRMATION' || order.state === 'PENDING_DEPOSIT'
  })

export const getSellQuote = (state: RootState) => state.components.simpleBuy.sellQuote

export const getSellOrder = (state: RootState) => state.components.simpleBuy.sellOrder

export const getStep = (state: RootState) => state.components.simpleBuy.step

export const getSwapAccount = (state: RootState) => state.components.simpleBuy.swapAccount

// Sell specific (for now!)
// used for sell only now, eventually buy as well
// TODO: use swap2 quote for buy AND sell
export const getPayment = (state: RootState) => state.components.simpleBuy.payment

export const getIncomingAmount = (state: RootState) => {
  const quoteR = getSellQuote(state)
  const values = (selectors.form.getFormValues('simpleBuyCheckout')(
    state
  ) as SBCheckoutFormValuesType) || { amount: '0', fix: 'CRYPTO' }

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

export const getSddEligible = (state: RootState) => state.components.simpleBuy.sddEligible

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

export const getUserLimit = (state: RootState, type: SBPaymentTypes) => {
  const sbMethodsR = getSBPaymentMethods(state)
  return lift((sbMethods: ExtractSuccess<typeof sbMethodsR>) => {
    const paymentMethod = sbMethods.methods.find((method) => method.type === type)
    return paymentMethod?.limits || LIMIT
  })(sbMethodsR)
}

export const getSddVerified = (state: RootState) => state.components.simpleBuy.sddVerified

export const isUserSddVerified = (state: RootState) => {
  const sddVerifiedR = getSddVerified(state)
  return lift(
    (sddVerified: ExtractSuccess<typeof sddVerifiedR>) =>
      sddVerified.taskComplete && sddVerified.verified
  )(sddVerifiedR)
}
export const getLimits = (state: RootState) => state.components.simpleBuy.limits

export const getSddTransactionFinished = (state: RootState) =>
  state.components.simpleBuy.sddTransactionFinished
