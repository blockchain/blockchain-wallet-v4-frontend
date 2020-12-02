import {
  convertBaseToStandard,
  convertStandardToBase
} from '../exchange/services'
import {
  ExtractSuccess,
  FiatTypeEnum,
  SBPaymentMethodType
} from 'blockchain-wallet-v4/src/types'
import { FiatType } from 'core/types'
import { getInputFromPair, getOutputFromPair } from '../swap/model'
import { getQuote } from 'blockchain-wallet-v4-frontend/src/modals/SimpleBuy/EnterAmount/Checkout/validation'
import { getRate } from '../swap/utils'
import { head, isEmpty, lift } from 'ramda'
import { RootState } from 'data/rootReducer'
import { SBCheckoutFormValuesType } from './types'
import { selectors } from 'data'
import BigNumber from 'bignumber.js'

export const getAddBank = (state: RootState) =>
  state.components.simpleBuy.addBank

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

const eligableFiatCurrency = currency =>
  currency === FiatTypeEnum.USD ||
  currency === FiatTypeEnum.GBP ||
  currency === FiatTypeEnum.EUR

export const getDefaultPaymentMethod = (state: RootState) => {
  const fiatCurrency = getFiatCurrency(state)
  const orders = getSBOrders(state).getOrElse([])
  const sbCardsR = getSBCards(state)
  const sbMethodsR = getSBPaymentMethods(state)
  const actionType = getOrderType(state)
  const sbBalancesR = getSBBalances(state)

  const transform = (
    sbCards: ExtractSuccess<typeof sbCardsR>,
    sbMethods: ExtractSuccess<typeof sbMethodsR>,
    sbBalances: ExtractSuccess<typeof sbBalancesR>
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
        let fiatCurrencyToUse = fiatCurrency
        if (!eligableFiatCurrency(fiatCurrencyToUse)) {
          const currenciesToUse = [
            FiatTypeEnum.USD,
            FiatTypeEnum.GBP,
            FiatTypeEnum.EUR
          ]
          const balancesToUse = Object.keys(sbBalances)
            .filter(key => currenciesToUse.indexOf(FiatTypeEnum[key]) >= 0)
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
          method =>
            method.type === 'FUNDS' && method.currency === fiatCurrencyToUse
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

            if (!card) return undefined

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

  return lift(transform)(sbCardsR, sbMethodsR, sbBalancesR)
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

export const getSellOrder = (state: RootState) =>
  state.components.simpleBuy.sellOrder

export const getStep = (state: RootState) => state.components.simpleBuy.step

export const getSwapAccount = (state: RootState) =>
  state.components.simpleBuy.swapAccount

// Sell specific (for now!)
// used for sell only now, eventually buy as well
// TODO: use swap2 quote for buy AND sell
export const getPayment = (state: RootState) =>
  state.components.simpleBuy.payment

export const getSellQuote = (state: RootState) =>
  state.components.simpleBuy.sellQuote

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
    const exRate = new BigNumber(
      getRate(quote.quote.priceTiers, toCoin, new BigNumber(amtMinor))
    )
    const feeMajor = convertBaseToStandard(toCoin, quote.networkFee)

    const amt = exRate.times(amount).minus(feeMajor)
    const isNegative = amt.isLessThanOrEqualTo(0)

    return {
      amt: isNegative ? 0 : amt,
      isNegative
    }
  })(quoteR)
}
