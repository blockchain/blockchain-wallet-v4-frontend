import BigNumber from 'bignumber.js'

import { coinToString, fiatToString } from 'core/exchange/currency'
import { convertBaseToStandard } from 'data/components/exchange/services'
import {
  getCoinFromPair,
  getFiatFromPair
} from 'data/components/simpleBuy/model'
import { Props } from './template.success'
import {
  SBBalancesType,
  SBOrderActionType,
  SBPairType,
  SBPaymentMethodType,
  SBQuoteType
} from 'core/types'
import { SBCheckoutFormValuesType, SBFixType } from 'data/types'
import { UnitType } from 'core/exchange'
import Currencies from 'blockchain-wallet-v4/src/exchange/currencies'

export const getQuote = (
  quote: SBQuoteType,
  fix: SBFixType,
  baseAmount?: string
) => {
  if (fix === 'FIAT') {
    const coin = getCoinFromPair(quote.pair)
    const decimals = Currencies[coin].units[coin as UnitType].decimal_digits
    const standardRate = convertBaseToStandard('FIAT', quote.rate)
    return new BigNumber(baseAmount || '0')
      .dividedBy(standardRate)
      .toFixed(decimals)
  } else {
    const fiat = getFiatFromPair(quote.pair)
    const decimals = Currencies[fiat].units[fiat as UnitType].decimal_digits
    const standardRate = convertBaseToStandard('FIAT', quote.rate)
    return new BigNumber(baseAmount || '0')
      .times(standardRate)
      .toFixed(decimals)
  }
}

export const formatQuote = (
  amt: string,
  quote: SBQuoteType,
  fix: SBFixType
) => {
  if (fix === 'FIAT') {
    return coinToString({
      value: amt,
      unit: { symbol: getCoinFromPair(quote.pair) }
    })
  } else {
    return fiatToString({
      value: amt,
      unit: getFiatFromPair(quote.pair)
    })
  }
}

export const getMaxMin = (
  minOrMax: 'min' | 'max',
  sbBalances: SBBalancesType,
  orderType: SBOrderActionType,
  quote: SBQuoteType,
  pair: SBPairType,
  allValues?: SBCheckoutFormValuesType,
  method?: SBPaymentMethodType
): { CRYPTO: string; FIAT: string } => {
  switch (orderType) {
    case 'BUY':
      switch (minOrMax) {
        case 'max':
          let defaultMax = {
            FIAT: convertBaseToStandard('FIAT', pair.buyMax),
            CRYPTO: getQuote(
              quote,
              'FIAT',
              convertBaseToStandard('FIAT', pair.buyMax)
            )
          }

          if (!allValues) return defaultMax
          if (!method) return defaultMax

          let max = BigNumber.minimum(method.limits.max, pair.buyMax).toString()

          if (method.type === 'FUNDS' && sbBalances)
            max = sbBalances[method.currency]?.available || '0'

          const maxFiat = convertBaseToStandard('FIAT', max)
          const maxCrypto = getQuote(quote, 'FIAT', maxFiat)

          return { FIAT: maxFiat, CRYPTO: maxCrypto }
        case 'min':
          let defaultMin = {
            FIAT: convertBaseToStandard('FIAT', pair.buyMin),
            CRYPTO: getQuote(
              quote,
              'FIAT',
              convertBaseToStandard('FIAT', pair.buyMin)
            )
          }

          if (!allValues) return defaultMin
          if (!method) return defaultMin

          const min = BigNumber.maximum(
            method.limits.min,
            pair.buyMin
          ).toString()

          const minFiat = convertBaseToStandard('FIAT', min)
          const minCrypto = getQuote(quote, 'FIAT', minFiat)

          return { FIAT: minFiat, CRYPTO: minCrypto }
      }
      break
    case 'SELL':
      const coin = getCoinFromPair(pair.pair)
      const rate = quote.rate
      switch (minOrMax) {
        case 'max':
          const maxAvailable = sbBalances[coin]?.available || '0'

          const maxCrypto = convertBaseToStandard(coin, maxAvailable)
          const maxFiat = getQuote(quote, 'CRYPTO', maxCrypto)
          return { FIAT: maxFiat, CRYPTO: maxCrypto }
        case 'min':
          const minStandard = convertBaseToStandard(
            'FIAT',
            new BigNumber(pair.sellMin)
          )

          const minCrypto = new BigNumber(minStandard)
            .dividedBy(rate)
            .toFixed(Currencies[coin].units[coin].decimal_digits)
          const minFiat = minStandard

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
    method: selectedMethod,
    orderType,
    pair,
    quote,
    sbBalances
  } = restProps
  const method = selectedMethod || defaultMethod
  if (!allValues) return

  return Number(value) >
    Number(
      getMaxMin('max', sbBalances, orderType, quote, pair, allValues, method)[
        allValues.fix
      ]
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
    method: selectedMethod,
    orderType,
    pair,
    quote,
    sbBalances
  } = restProps
  const method = selectedMethod || defaultMethod
  if (!allValues) return

  return Number(value) <
    Number(
      getMaxMin('min', sbBalances, orderType, quote, pair, allValues, method)[
        allValues.fix
      ]
    )
    ? 'BELOW_MIN'
    : false
}
