import BigNumber from 'bignumber.js'

import { UnitType } from '@core/exchange'
import Currencies from '@core/exchange/currencies'
import { coinToString, fiatToString } from '@core/exchange/utils'
import {
  BSBalancesType,
  BSOrderActionType,
  BSPairType,
  BSPaymentMethodType,
  BSPaymentTypes,
  BSQuoteType,
  BuyQuoteStateType,
  OrderType,
  PaymentValue,
  SwapQuoteStateType,
  SwapUserLimitsType
} from '@core/types'
import { model } from 'data'
import { getCoinFromPair, getFiatFromPair } from 'data/components/buySell/model'
import { convertBaseToStandard } from 'data/components/exchange/services'
import { BSCheckoutFormValuesType, BSFixType, SwapAccountType } from 'data/types'

import { Props } from './template.success'
import { Limits } from './types'

const { LIMIT } = model.components.buySell

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

export const getBuyQuote = (
  pair: string,
  rate: number | string,
  fix: BSFixType,
  baseAmount?: string
) => {
  const coin = getCoinFromPair(pair)
  if (fix === 'FIAT') {
    const decimals = window.coins[coin].coinfig.precision
    const standardRate = convertBaseToStandard(coin, rate) // BTC, 2278 = 0.00002278
    // ex. 0.00002756 BTC * 10,000 USD = 0.2756 BTC
    return new BigNumber(standardRate).times(baseAmount || '0').toFixed(decimals)
  }
  const fiat = getFiatFromPair(pair)
  const decimals = Currencies[fiat].units[fiat as UnitType].decimal_digits
  const standardRate = convertBaseToStandard(coin, rate)
  // ex. 0.2756 BTC / 0.00002756 BTC = 10,000 USD
  return new BigNumber(baseAmount || '0').dividedBy(standardRate).toFixed(decimals)
}

export const formatQuote = (amt: string, pair: string, fix: BSFixType): string => {
  if (fix === 'FIAT') {
    return coinToString({
      unit: { symbol: getCoinFromPair(pair) },
      value: amt
    })
  }
  return fiatToString({
    unit: getFiatFromPair(pair),
    value: amt
  })
}

// used for sell only now, eventually buy as well
// TODO: use swap2 quote for buy AND sell
export const getMaxMinSell = (
  minOrMax: 'min' | 'max',
  sbBalances: BSBalancesType,
  orderType: BSOrderActionType,
  quote: SwapQuoteStateType,
  pair: BSPairType,
  payment?: PaymentValue,
  allValues?: BSCheckoutFormValuesType,
  method?: BSPaymentMethodType,
  account?: SwapAccountType
): { CRYPTO: string; FIAT: string; type: Limits } => {
  switch (orderType as OrderType) {
    case OrderType.BUY:
      // Not implemented
      return { CRYPTO: '0', FIAT: '0', type: Limits.ABOVE_MAX }
    case OrderType.SELL:
      const coin = getCoinFromPair(pair.pair)
      const { rate } = quote
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
    default:
      return { CRYPTO: '0', FIAT: '0', type: Limits.ABOVE_MAX }
  }
}

export const getMaxMin = (
  minOrMax: 'min' | 'max',
  sbBalances: BSBalancesType,
  orderType: BSOrderActionType,
  QUOTE: BSQuoteType | SwapQuoteStateType | BuyQuoteStateType,
  pair: BSPairType,
  isFlexiblePricingModel: boolean,
  payment?: PaymentValue,
  allValues?: BSCheckoutFormValuesType,
  method?: BSPaymentMethodType,
  account?: SwapAccountType,
  isSddFlow = false,
  sddLimit = LIMIT,
  limits?: SwapUserLimitsType
): { CRYPTO: string; FIAT: string; type?: Limits } => {
  let quote: BSQuoteType | SwapQuoteStateType | BuyQuoteStateType
  switch (orderType as OrderType) {
    case OrderType.BUY:
      quote = QUOTE as BSQuoteType | BuyQuoteStateType
      let limitType = Limits.ABOVE_MAX
      switch (minOrMax) {
        case 'max':
          // we need minimum of all max amounts including limits
          let limitMaxAmount = Number(pair.buyMax)
          let limitMaxChanged = false
          if (limits?.maxOrder) {
            const buyMaxItem = Number(limitMaxAmount)
            // 1000.00 => 100000 since all other amounts are in base we do convert this in base
            const maxOrderBase = convertBaseToStandard('FIAT', limits.maxOrder, false)

            const baseMaxLimitAmount = Number(maxOrderBase)
            if (baseMaxLimitAmount < buyMaxItem && !isSddFlow) {
              limitMaxAmount = baseMaxLimitAmount
              limitMaxChanged = true
            }
          }

          const defaultMax = {
            CRYPTO: isFlexiblePricingModel
              ? getBuyQuote(
                  quote.pair,
                  quote.rate,
                  'FIAT',
                  isSddFlow
                    ? convertBaseToStandard('FIAT', Number(sddLimit.max))
                    : convertBaseToStandard('FIAT', pair.buyMax)
                )
              : getQuote(
                  quote.pair,
                  quote.rate,
                  'FIAT',
                  isSddFlow
                    ? convertBaseToStandard('FIAT', Number(sddLimit.max))
                    : convertBaseToStandard('FIAT', pair.buyMax)
                ),
            FIAT: isSddFlow
              ? convertBaseToStandard('FIAT', Number(sddLimit.max))
              : convertBaseToStandard('FIAT', pair.buyMax),
            type: limitType
          }

          // we have to convert in case that this amount is from maxOrder
          // we have to convert it to Standard since defaultMax is in standard format
          const defaultMaxCompare = limitMaxChanged
            ? Number(convertBaseToStandard('FIAT', limitMaxAmount))
            : limitMaxAmount
          if (Number(defaultMax.FIAT) > defaultMaxCompare && limitMaxChanged) {
            defaultMax.FIAT = String(defaultMaxCompare)
          }

          if (!allValues) return defaultMax
          if (!method) return defaultMax

          let max = BigNumber.minimum(
            method.limits.max,
            isSddFlow ? sddLimit.max : pair.buyMax,
            isSddFlow ? sddLimit.max : limitMaxAmount
          ).toString()

          let fundsChangedMax = false
          if (method.type === BSPaymentTypes.FUNDS && sbBalances && limits?.maxPossibleOrder) {
            const available = sbBalances[method.currency]?.available || '0'
            // available is always in minor string
            const availableStandard = available
              ? convertBaseToStandard('FIAT', available)
              : available
            switch (true) {
              case !availableStandard:
              default:
                max = '0'
                break
              case Number(availableStandard) >= Number(limits.maxPossibleOrder):
                max = limits.maxPossibleOrder
                limitType = Limits.ABOVE_LIMIT
                fundsChangedMax = true
                break
              case Number(availableStandard) < Number(limits.maxPossibleOrder):
                max = availableStandard
                limitType = Limits.ABOVE_BALANCE
                fundsChangedMax = true
                break
            }
          }

          const maxFiat = !fundsChangedMax ? convertBaseToStandard('FIAT', max) : max

          let maxCrypto
          if (isFlexiblePricingModel) {
            maxCrypto = getBuyQuote(quote.pair, quote.rate, 'FIAT', maxFiat)
          } else {
            maxCrypto = getQuote(quote.pair, quote.rate, 'FIAT', maxFiat)
          }

          return { CRYPTO: maxCrypto, FIAT: maxFiat, type: limitType }
        case 'min':
          // we need maximum of all min amounts including limits
          let limitMinAmount = Number(pair.buyMin)
          let limitMinChanged = false
          if (limits?.minOrder) {
            const minOrderBase = convertBaseToStandard('FIAT', limits.minOrder, false)
            const baseMinLimitAmount = Number(minOrderBase)
            if (baseMinLimitAmount > limitMinAmount && !isSddFlow) {
              limitMinAmount = baseMinLimitAmount
              limitMinChanged = true
            }
          }

          const defaultMin = {
            CRYPTO: isFlexiblePricingModel
              ? getBuyQuote(
                  quote.pair,
                  quote.rate,
                  'FIAT',
                  isSddFlow
                    ? convertBaseToStandard('FIAT', Number(sddLimit.min))
                    : convertBaseToStandard('FIAT', pair.buyMin)
                )
              : getQuote(
                  quote.pair,
                  quote.rate,
                  'FIAT',
                  isSddFlow
                    ? convertBaseToStandard('FIAT', Number(sddLimit.min))
                    : convertBaseToStandard('FIAT', pair.buyMin)
                ),
            FIAT: isSddFlow
              ? convertBaseToStandard('FIAT', Number(sddLimit.min))
              : convertBaseToStandard('FIAT', pair.buyMin)
          }

          const defaultMinCompare = limitMinChanged
            ? Number(convertBaseToStandard('FIAT', limitMinAmount))
            : limitMinAmount
          if (Number(defaultMin.FIAT) < defaultMinCompare && limitMinChanged) {
            defaultMin.FIAT = String(defaultMinCompare)
          }

          if (!allValues) return defaultMin
          if (!method) return defaultMin

          const min = BigNumber.maximum(
            method.limits.min,
            pair.buyMin,
            isSddFlow ? method.limits.min : limitMinAmount
          ).toString()

          const minFiat = convertBaseToStandard('FIAT', min)

          let minCrypto
          if (isFlexiblePricingModel) {
            minCrypto = getBuyQuote(quote.pair, quote.rate, 'FIAT', minFiat)
          } else {
            minCrypto = getQuote(quote.pair, quote.rate, 'FIAT', minFiat)
          }

          return { CRYPTO: minCrypto, FIAT: minFiat }
        default:
          return { CRYPTO: '0', FIAT: '0' }
      }
    case OrderType.SELL:
      quote = QUOTE as SwapQuoteStateType
      return getMaxMinSell(
        minOrMax,
        sbBalances,
        orderType,
        quote,
        pair,
        payment,
        allValues,
        method,
        account
      )
    default:
      return { CRYPTO: '0', FIAT: '0' }
  }
}

export const useConvertedValue = (orderType: BSOrderActionType, fix: BSFixType): boolean => {
  return (
    (orderType === OrderType.BUY && fix === 'CRYPTO') ||
    (orderType === OrderType.SELL && fix === 'FIAT')
  )
}

export const maximumAmount = (
  value: string,
  allValues: BSCheckoutFormValuesType,
  restProps: Props
): boolean | string => {
  if (!value) return true

  const {
    defaultMethod,
    isFlexiblePricingModel,
    isSddFlow,
    limits,
    method: selectedMethod,
    orderType,
    pair,
    payment,
    quote,
    sbBalances,
    sddLimit,
    swapAccount
  } = restProps

  const method = selectedMethod || defaultMethod
  if (!allValues) return false

  const maxMinAmount = getMaxMin(
    'max',
    sbBalances,
    orderType,
    quote,
    pair,
    isFlexiblePricingModel,
    payment,
    allValues,
    method,
    swapAccount,
    isSddFlow,
    sddLimit,
    limits
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
    isFlexiblePricingModel,
    isSddFlow,
    limits,
    method: selectedMethod,
    orderType,
    pair,
    payment,
    quote,
    sbBalances,
    sddLimit,
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
        quote,
        pair,
        isFlexiblePricingModel,
        payment,
        allValues,
        method,
        swapAccount,
        isSddFlow,
        sddLimit,
        limits
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
