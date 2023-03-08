import BigNumber from 'bignumber.js'

import { Exchange } from '@core'
import { PaymentValue, RatesType, SwapUserLimitsType } from '@core/types'
import { convertBaseToStandard, convertStandardToBase } from 'data/components/exchange/services'
import {
  BSCheckoutFormValuesType,
  QuotePrice,
  SwapAccountType,
  SwapAmountFormValues
} from 'data/types'
import { CRYPTO_DECIMALS } from 'services/forms'

import { Props } from '.'

export const getMaxMin = (
  minOrMax: 'min' | 'max',
  limits: SwapUserLimitsType,
  baseRate: RatesType,
  payment: undefined | PaymentValue,
  quotePrice: QuotePrice,
  BASE: SwapAccountType
) => {
  switch (minOrMax) {
    case 'max':
      const fiatMax = new BigNumber(convertBaseToStandard('FIAT', limits.maxPossibleOrder))
      const cryptoMax = new BigNumber(
        convertStandardToBase(BASE.coin, fiatMax.dividedBy(baseRate.price))
      )
      const userMax = Number(payment ? payment.effectiveBalance : BASE.balance)
      return convertBaseToStandard(BASE.coin, Math.min(userMax, cryptoMax.toNumber()))
    case 'min':
      // AOTW = As Of This Writing
      // ℹ️
      // Let's say you are swapping ETH -> BTC
      // Let's say the BTC fee is 0.0004517 BTC a.k.a 7 USD (AOTW)
      // Let's say the minimum you can swap is 3.5 USD
      // Since 3.5 USD < 7 USD, you would receive -3.5 USD
      // In that case we say your minimum is the BTC fee + your minimum
      // 7 USD + 3.5 USD = 10.5 USD
      // ℹ️

      // ℹ️
      // In that case you would pay a huge BTC fee, but still end up with
      // at least the minimum you are allowed swap (send) (3.5 USD)
      // ℹ️

      // /trades/limits is returned in FIAT (3.5 USD)
      const fiatMin = convertBaseToStandard('FIAT', limits.minOrder)
      // convert 3.5 USD to BASE coin (0.01123091 ETH)
      const baseMin = new BigNumber(fiatMin).dividedBy(baseRate.price).toNumber()

      // calculate the BTC -> ETH rate
      // 1 BTC = 39.12444194 ETH
      const exRate = new BigNumber(1).dividedBy(quotePrice.data.price)
      // BTC fee is 0.0004517 BTC
      const standardCounterFee = quotePrice.data.networkFee
      // 4517 satoshi is 0.017672510 ETH is 7 USD (AOTW)
      const counterFeeInBase = exRate.times(standardCounterFee).toNumber()

      // We add 7 USD to 3.5 USD so worst case user receives 3.5 USD of BTC
      return (counterFeeInBase + baseMin).toPrecision(CRYPTO_DECIMALS)
    default:
      break
  }
}

export const maximumAmount = (value: string, allValues: SwapAmountFormValues, restProps: Props) => {
  if (!value) return true
  if (!allValues) return

  // @ts-ignore
  const { baseRates, fix, limits, payment, quotePrice, walletCurrency } = restProps

  const cryptoMax = Number(getMaxMin('max', limits, baseRates, payment, quotePrice, restProps.BASE))
  // const maxType = getMaxType(Number(value), limits, baseRates, payment, restProps.BASE)

  const fiatMax = Exchange.convertCoinToFiat({
    coin: restProps.BASE.coin,
    currency: walletCurrency,
    isStandard: true,
    rates: baseRates,
    value: cryptoMax
  })

  let maxType = 'ABOVE_MAX'
  if (Number(value) > Number(payment ? payment.effectiveBalance : restProps.BASE.balance)) {
    maxType = 'ABOVE_BALANCE'
  }

  return Number(value) > (fix === 'CRYPTO' ? cryptoMax : fiatMax) ? maxType : false
}

export const minimumAmount = (value: string, allValues: SwapAmountFormValues, restProps: Props) => {
  if (!value) return true
  if (!allValues) return

  // @ts-ignore
  const { baseRates, fix, limits, payment, quotePrice, walletCurrency } = restProps

  const cryptoMin = Number(getMaxMin('min', limits, baseRates, payment, quotePrice, restProps.BASE))
  const fiatMin = Exchange.convertCoinToFiat({
    coin: restProps.BASE.coin,
    currency: walletCurrency,
    isStandard: true,
    rates: baseRates,
    value: cryptoMin
  })

  return Number(value) < (fix === 'CRYPTO' ? cryptoMin : fiatMin) ? 'BELOW_MIN' : undefined
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
