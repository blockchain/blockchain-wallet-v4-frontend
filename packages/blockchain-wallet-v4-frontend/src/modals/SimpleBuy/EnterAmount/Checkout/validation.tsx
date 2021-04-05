import BigNumber from 'bignumber.js'

import { UnitType } from 'blockchain-wallet-v4/src/exchange'
import Currencies from 'blockchain-wallet-v4/src/exchange/currencies'
import {
  coinToString,
  fiatToString
} from 'blockchain-wallet-v4/src/exchange/currency'
import {
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
import {
  getCoinFromPair,
  getFiatFromPair
} from 'data/components/simpleBuy/model'
import {
  SBCheckoutFormValuesType,
  SBFixType,
  SwapAccountType
} from 'data/types'

import { Props } from './template.success'

const { LIMIT } = model.components.simpleBuy

export const getQuote = (
  pair: string,
  rate: number | string,
  fix: SBFixType,
  baseAmount?: string
) => {
  if (fix === 'FIAT') {
    const coin = getCoinFromPair(pair)
    const decimals = Currencies[coin].units[coin as UnitType].decimal_digits
    const standardRate = convertBaseToStandard('FIAT', rate)
    return new BigNumber(baseAmount || '0')
      .dividedBy(standardRate)
      .toFixed(decimals)
  } else {
    const fiat = getFiatFromPair(pair)
    const decimals = Currencies[fiat].units[fiat as UnitType].decimal_digits
    const standardRate = convertBaseToStandard('FIAT', rate)
    return new BigNumber(baseAmount || '0')
      .times(standardRate)
      .toFixed(decimals)
  }
}

export const formatQuote = (
  amt: string,
  pair: string,
  fix: SBFixType,
  supportedCoins: SupportedWalletCurrenciesType
) => {
  if (fix === 'FIAT') {
    return coinToString({
      value: amt,
      unit: { symbol: supportedCoins[getCoinFromPair(pair)].coinTicker }
    })
  } else {
    return fiatToString({
      value: amt,
      unit: getFiatFromPair(pair)
    })
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
  isSddFlow: boolean = false,
  sddLimit = LIMIT,
  limits?: SwapUserLimitsType
): { CRYPTO: string; FIAT: string } => {
  let quote: SBQuoteType | { quote: SwapQuoteType; rate: number }
  switch (orderType) {
    case 'BUY':
      quote = QUOTE as SBQuoteType
      switch (minOrMax) {
        case 'max':
          let defaultMax = {
            FIAT: isSddFlow
              ? convertBaseToStandard('FIAT', Number(sddLimit.max))
              : convertBaseToStandard('FIAT', pair.buyMax),
            CRYPTO: getQuote(
              quote.pair,
              quote.rate,
              'FIAT',
              isSddFlow
                ? convertBaseToStandard('FIAT', Number(sddLimit.max))
                : convertBaseToStandard('FIAT', pair.buyMax)
            )
          }

          if (!allValues) return defaultMax
          if (!method) return defaultMax

          let max = BigNumber.minimum(
            method.limits.max,
            isSddFlow ? Number(sddLimit.max) : pair.buyMax
          ).toString()

          if (
            method.type === 'FUNDS' &&
            sbBalances &&
            limits?.maxPossibleOrder
          ) {
            const { available } = sbBalances[method.currency]
            switch (true) {
              case !available:
              default:
                max = '0'
                break
              case Number(available) >= Number(limits.maxPossibleOrder):
                max = limits.maxPossibleOrder
                break
              case Number(available) < Number(limits.maxPossibleOrder):
                max = available
                break
            }
          }
          const maxFiat = convertBaseToStandard('FIAT', max)
          const maxCrypto = getQuote(quote.pair, quote.rate, 'FIAT', maxFiat)

          return { FIAT: maxFiat, CRYPTO: maxCrypto }
        case 'min':
          let defaultMin = {
            FIAT: isSddFlow
              ? convertBaseToStandard('FIAT', Number(sddLimit.min))
              : convertBaseToStandard('FIAT', pair.buyMin),
            CRYPTO: getQuote(
              quote.pair,
              quote.rate,
              'FIAT',
              isSddFlow
                ? convertBaseToStandard('FIAT', Number(sddLimit.min))
                : convertBaseToStandard('FIAT', pair.buyMin)
            )
          }

          if (!allValues) return defaultMin
          if (!method) return defaultMin

          const min = BigNumber.maximum(
            method.limits.min,
            pair.buyMin
          ).toString()

          const minFiat = convertBaseToStandard('FIAT', min)
          const minCrypto = getQuote(quote.pair, quote.rate, 'FIAT', minFiat)

          return { FIAT: minFiat, CRYPTO: minCrypto }
      }
      break
    case 'SELL':
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
  }
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
  switch (orderType) {
    case 'BUY':
      // Not implemented
      return { CRYPTO: '0', FIAT: '0' }
    case 'SELL':
      const coin = getCoinFromPair(pair.pair)
      const rate = quote.rate
      switch (minOrMax) {
        case 'max':
          const maxAvailable = account
            ? account.balance
            : sbBalances[coin]?.available || '0'

          const maxSell = new BigNumber(pair.sellMax)
            .dividedBy(rate)
            .toFixed(Currencies[coin].units[coin].decimal_digits)

          const userMax = Number(
            payment ? payment.effectiveBalance : maxAvailable
          )
          const maxCrypto = Math.min(
            Number(convertBaseToStandard(coin, userMax)),
            Number(maxSell)
          ).toString()
          const maxFiat = getQuote(pair.pair, rate, 'CRYPTO', maxCrypto)
          return { FIAT: maxFiat, CRYPTO: maxCrypto }
        case 'min':
          const minCrypto = new BigNumber(pair.sellMin)
            .dividedBy(rate)
            .toFixed(Currencies[coin].units[coin].decimal_digits)
          const minFiat = convertBaseToStandard('FIAT', pair.sellMin)

          return { FIAT: minFiat, CRYPTO: minCrypto }
      }
  }
}

export const useConvertedValue = (
  orderType: SBOrderActionType,
  fix: SBFixType
) => {
  return (
    (orderType === 'BUY' && fix === 'CRYPTO') ||
    (orderType === 'SELL' && fix === 'FIAT')
  )
}

export const maximumAmount = (
  value: string,
  allValues: SBCheckoutFormValuesType,
  restProps: Props
) => {
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
  if (!allValues) return

  if (
    limits?.maxPossibleOrder &&
    Number(limits.maxPossibleOrder) < Number(sddLimit.max)
  ) {
    sddLimit.max = limits.maxPossibleOrder
  }

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
) => {
  if (!value) return true

  const {
    defaultMethod,
    isSddFlow,
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
  if (!allValues) return

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
        sddLimit
      )[allValues.fix]
    )
    ? 'BELOW_MIN'
    : false
}
