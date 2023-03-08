import BigNumber from 'bignumber.js'

import { UnitType } from '@core/exchange'
import Currencies from '@core/exchange/currencies'
import {
  BSBalancesType,
  BSOrderActionType,
  BSPairType,
  BSPaymentMethodType,
  PaymentValue
} from '@core/types'
import { getCoinFromPair, getFiatFromPair } from 'data/components/buySell/model'
import { convertBaseToStandard } from 'data/components/exchange/services'
import { BSCheckoutFormValuesType, BSFixType, SwapAccountType } from 'data/types'

import { Props } from './template.success'
import { Limits } from './types'

export const getQuote = (
  pair: string,
  rate: number | string,
  fix: BSFixType,
  baseAmount?: string
): string => {
  if (fix === 'FIAT') {
    const coin = getCoinFromPair(pair)
    const decimals = window.coins[coin].coinfig.precision
    const standardRate = convertBaseToStandard('FIAT', rate)
    return new BigNumber(baseAmount || '0').dividedBy(standardRate).toFixed(decimals)
  }
  const fiat = getFiatFromPair(pair)
  const decimals = Currencies[fiat].units[fiat as UnitType].decimal_digits
  const standardRate = convertBaseToStandard('FIAT', rate)
  return new BigNumber(baseAmount || '0').times(standardRate).toFixed(decimals)
}

export const getMaxMin = (
  minOrMax: 'min' | 'max',
  sbBalances: BSBalancesType,
  orderType: BSOrderActionType,
  rate: number,
  pair: BSPairType,
  payment?: PaymentValue,
  allValues?: BSCheckoutFormValuesType,
  method?: BSPaymentMethodType,
  account?: SwapAccountType
): { CRYPTO: string; FIAT: string; type?: Limits } => {
  const coin = getCoinFromPair(pair.pair)
  switch (minOrMax) {
    case 'max':
      const maxAvailable = account ? account.balance : sbBalances[coin]?.available || '0'

      const maxSell = new BigNumber(pair.sellMax)
        .dividedBy(rate)
        .toFixed(window.coins[coin] ? window.coins[coin].coinfig.precision : 2)

      const userMax = Number(payment ? payment.effectiveBalance : maxAvailable)
      const maxCrypto = Math.min(
        Number(convertBaseToStandard(coin, userMax)),
        Number(maxSell)
      ).toString()
      const maxFiat = getQuote(pair.pair, rate, 'CRYPTO', maxCrypto)
      return { CRYPTO: maxCrypto, FIAT: maxFiat, type: Limits.ABOVE_MAX }
    case 'min':
      const minCrypto = new BigNumber(pair.sellMin)
        .dividedBy(rate)
        .toFixed(window.coins[coin] ? window.coins[coin].coinfig.precision : 2)
      const minFiat = convertBaseToStandard('FIAT', pair.sellMin)

      return { CRYPTO: minCrypto, FIAT: minFiat, type: Limits.ABOVE_MAX }
    default:
      return { CRYPTO: '0', FIAT: '0', type: Limits.ABOVE_MAX }
  }
}

export const maximumAmount = (
  value: string,
  allValues: BSCheckoutFormValuesType,
  restProps: Props
): boolean | string => {
  if (!value) return true

  const {
    defaultMethod,
    method: selectedMethod,
    orderType,
    pair,
    payment,
    quote,
    sbBalances,
    swapAccount
  } = restProps

  const method = selectedMethod || defaultMethod
  if (!allValues) return false

  const maxMinAmount = getMaxMin(
    'max',
    sbBalances,
    orderType,
    quote.rate,
    pair,
    payment,
    allValues,
    method,
    swapAccount
  )
  const errorType = maxMinAmount.type || Limits.ABOVE_MAX
  return Number(value) > Number(maxMinAmount[allValues.fix]) ? errorType : false
}

export const minimumAmount = (
  value: string,
  allValues: BSCheckoutFormValuesType,
  restProps: Props
): boolean | string => {
  if (!value) return true

  const {
    defaultMethod,
    method: selectedMethod,
    orderType,
    pair,
    payment,
    quote,
    sbBalances,
    swapAccount
  } = restProps
  const method = selectedMethod || defaultMethod
  if (!allValues) return false
  return Number(value) <
    Number(
      getMaxMin(
        'min',
        sbBalances,
        orderType,
        quote.rate,
        pair,
        payment,
        allValues,
        method,
        swapAccount
      )[allValues.fix]
    )
    ? 'BELOW_MIN'
    : false
}

export const checkCrossBorderLimit = (
  value: string,
  allValues: BSCheckoutFormValuesType,
  props: Props
): boolean | string => {
  const { crossBorderLimits } = props

  if (!crossBorderLimits?.current) {
    return false
  }

  const { value: availableAmount } = crossBorderLimits?.current?.available
  const availableAmountInBase = convertBaseToStandard('FIAT', availableAmount)

  return Number(value) > Number(availableAmountInBase) ? 'ABOVE_MAX_LIMIT' : false
}
