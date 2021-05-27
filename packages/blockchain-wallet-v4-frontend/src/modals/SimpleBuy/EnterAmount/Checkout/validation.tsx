import BigNumber from 'bignumber.js'

import { UnitType } from 'blockchain-wallet-v4/src/exchange'
import Currencies from 'blockchain-wallet-v4/src/exchange/currencies'
import { coinToString, fiatToString } from 'blockchain-wallet-v4/src/exchange/currency'
import {
  OrderType,
  PaymentValue,
  SBBalancesType,
  SBOrderActionType,
  SBPairType,
  SBPaymentMethodType,
  SBQuoteType,
  SupportedWalletCurrenciesType,
  SwapQuoteType,
  SwapUserLimitsType
} from 'blockchain-wallet-v4/src/types'
import { model } from 'data'
import { convertBaseToStandard } from 'data/components/exchange/services'
import { getCoinFromPair, getFiatFromPair } from 'data/components/simpleBuy/model'
import { SBCheckoutFormValuesType, SBFixType, SwapAccountType } from 'data/types'

import { Props } from './template.success'

const { LIMIT } = model.components.simpleBuy

export const getQuote = (
  pair: string,
  rate: number | string,
  fix: SBFixType,
  baseAmount?: string
): string => {
  if (fix === 'FIAT') {
    const coin = getCoinFromPair(pair)
    const decimals = Currencies[coin].units[coin as UnitType].decimal_digits
    const standardRate = convertBaseToStandard('FIAT', rate)
    return new BigNumber(baseAmount || '0').dividedBy(standardRate).toFixed(decimals)
  }
  const fiat = getFiatFromPair(pair)
  const decimals = Currencies[fiat].units[fiat as UnitType].decimal_digits
  const standardRate = convertBaseToStandard('FIAT', rate)
  return new BigNumber(baseAmount || '0').times(standardRate).toFixed(decimals)
}

export const formatQuote = (
  amt: string,
  pair: string,
  fix: SBFixType,
  supportedCoins: SupportedWalletCurrenciesType
): string => {
  if (fix === 'FIAT') {
    return coinToString({
      unit: { symbol: supportedCoins[getCoinFromPair(pair)].coinTicker },
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
  sbBalances: SBBalancesType,
  orderType: SBOrderActionType,
  quote: { quote: SwapQuoteType; rate: number },
  pair: SBPairType,
  payment?: PaymentValue,
  allValues?: SBCheckoutFormValuesType,
  method?: SBPaymentMethodType,
  account?: SwapAccountType
): { CRYPTO: string; FIAT: string } => {
  switch (orderType as OrderType) {
    case OrderType.BUY:
      // Not implemented
      return { CRYPTO: '0', FIAT: '0' }
    case OrderType.SELL:
      const coin = getCoinFromPair(pair.pair)
      const { rate } = quote
      switch (minOrMax) {
        case 'max':
          const maxAvailable = account ? account.balance : sbBalances[coin]?.available || '0'

          const maxSell = new BigNumber(pair.sellMax)
            .dividedBy(rate)
            .toFixed(Currencies[coin].units[coin].decimal_digits)

          const userMax = Number(payment ? payment.effectiveBalance : maxAvailable)
          const maxCrypto = Math.min(
            Number(convertBaseToStandard(coin, userMax)),
            Number(maxSell)
          ).toString()
          const maxFiat = getQuote(pair.pair, rate, 'CRYPTO', maxCrypto)
          return { CRYPTO: maxCrypto, FIAT: maxFiat }
        case 'min':
          const minCrypto = new BigNumber(pair.sellMin)
            .dividedBy(rate)
            .toFixed(Currencies[coin].units[coin].decimal_digits)
          const minFiat = convertBaseToStandard('FIAT', pair.sellMin)

          return { CRYPTO: minCrypto, FIAT: minFiat }
        default:
          return { CRYPTO: '0', FIAT: '0' }
      }
    default:
      return { CRYPTO: '0', FIAT: '0' }
  }
}

export const getMaxMin = (
  minOrMax: 'min' | 'max',
  sbBalances: SBBalancesType,
  orderType: SBOrderActionType,
  QUOTE: SBQuoteType | { quote: SwapQuoteType; rate: number },
  pair: SBPairType,
  payment?: PaymentValue,
  allValues?: SBCheckoutFormValuesType,
  method?: SBPaymentMethodType,
  account?: SwapAccountType,
  isSddFlow = false,
  sddLimit = LIMIT,
  limits?: SwapUserLimitsType
): { CRYPTO: string; FIAT: string } => {
  let quote: SBQuoteType | { quote: SwapQuoteType; rate: number }
  switch (orderType as OrderType) {
    case OrderType.BUY:
      quote = QUOTE as SBQuoteType
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
            CRYPTO: getQuote(
              quote.pair,
              quote.rate,
              'FIAT',
              isSddFlow
                ? convertBaseToStandard('FIAT', Number(sddLimit.max))
                : convertBaseToStandard('FIAT', pair.buyMax)
            ),
            FIAT: isSddFlow
              ? convertBaseToStandard('FIAT', Number(sddLimit.max))
              : convertBaseToStandard('FIAT', pair.buyMax)
          }

          // we have to convert in case that this ammount is from maxOrder
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
          if (method.type === 'FUNDS' && sbBalances && limits?.maxPossibleOrder) {
            const { available } = sbBalances[method.currency]
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
                fundsChangedMax = true
                break
              case Number(availableStandard) < Number(limits.maxPossibleOrder):
                max = availableStandard
                fundsChangedMax = true
                break
            }
          }

          const maxFiat = !fundsChangedMax ? convertBaseToStandard('FIAT', max) : max
          const maxCrypto = getQuote(quote.pair, quote.rate, 'FIAT', maxFiat)

          return { CRYPTO: maxCrypto, FIAT: maxFiat }
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
            CRYPTO: getQuote(
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

          const minFiat = !limitMinChanged ? convertBaseToStandard('FIAT', min) : min
          const minCrypto = getQuote(quote.pair, quote.rate, 'FIAT', minFiat)

          return { CRYPTO: minCrypto, FIAT: minFiat }
        default:
          return { CRYPTO: '0', FIAT: '0' }
      }
    case OrderType.SELL:
      quote = QUOTE as { quote: SwapQuoteType; rate: number }
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

export const useConvertedValue = (orderType: SBOrderActionType, fix: SBFixType): boolean => {
  return (
    (orderType === OrderType.BUY && fix === 'CRYPTO') ||
    (orderType === OrderType.SELL && fix === 'FIAT')
  )
}

export const maximumAmount = (
  value: string,
  allValues: SBCheckoutFormValuesType,
  restProps: Props
): boolean | string => {
  if (!value) return true

  const {
    defaultMethod,
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

  return Number(value) >
    Number(
      getMaxMin(
        'max',
        sbBalances,
        orderType,
        quote,
        pair,
        payment,
        allValues,
        method,
        swapAccount,
        isSddFlow,
        sddLimit,
        limits
      )[allValues.fix]
    )
    ? 'ABOVE_MAX'
    : false
}

export const minimumAmount = (
  value: string,
  allValues: SBCheckoutFormValuesType,
  restProps: Props
): boolean | string => {
  if (!value) return true

  const {
    defaultMethod,
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
