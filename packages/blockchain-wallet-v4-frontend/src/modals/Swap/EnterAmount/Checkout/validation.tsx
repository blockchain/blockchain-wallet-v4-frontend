import {
  CoinType,
  PaymentValue,
  RateType,
  SwapUserLimitsType
} from 'core/types'
import {
  convertBaseToStandard,
  convertStandardToBase
} from 'data/components/exchange/services'
import { CRYPTO_DECIMALS } from 'services/ValidationHelper'
import BigNumber from 'bignumber.js'

import { Props } from '.'
import { SwapAmountFormValues } from 'data/types'

export const getMaxMin = (
  minOrMax: 'min' | 'max',
  limits: SwapUserLimitsType,
  rate: RateType,
  payment: { coin: CoinType; effectiveBalance: number } | PaymentValue
) => {
  switch (minOrMax) {
    case 'max':
      const fiatMax = new BigNumber(
        convertBaseToStandard('FIAT', limits.maxPossibleOrder)
      )
      const cryptoMax = new BigNumber(
        convertStandardToBase(payment.coin, fiatMax.dividedBy(rate.last))
      )
      const userMax = payment.effectiveBalance
      return convertBaseToStandard(
        payment.coin,
        Math.min(userMax, cryptoMax.toNumber())
      )
    case 'min':
      const fiatMin = convertBaseToStandard('FIAT', limits.minOrder)
      return new BigNumber(fiatMin)
        .dividedBy(rate.last)
        .toPrecision(CRYPTO_DECIMALS)
  }
}

export const maximumAmount = (
  value: string,
  allValues: SwapAmountFormValues,
  restProps: Props
) => {
  if (!value) return true
  if (!allValues) return

  const { limits, rates, payment, walletCurrency } = restProps

  return Number(value) >
    Number(getMaxMin('max', limits, rates[walletCurrency], payment))
    ? 'ABOVE_MAX'
    : false
}

export const minimumAmount = (
  value: string,
  allValues: SwapAmountFormValues,
  restProps: Props
) => {
  if (!value) return true
  if (!allValues) return

  const { limits, rates, payment, walletCurrency } = restProps

  return Number(value) <
    Number(getMaxMin('min', limits, rates[walletCurrency], payment))
    ? 'BELOW_MIN'
    : false
}
