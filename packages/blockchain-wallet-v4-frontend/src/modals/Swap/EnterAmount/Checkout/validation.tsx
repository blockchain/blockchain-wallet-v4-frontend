import {
  convertBaseToStandard,
  convertStandardToBase
} from 'data/components/exchange/services'
import { CRYPTO_DECIMALS } from 'services/ValidationHelper'
import { PaymentValue, RateType, SwapUserLimitsType } from 'core/types'
import BigNumber from 'bignumber.js'

import { Props } from '.'
import { SwapAccountType, SwapAmountFormValues } from 'data/types'

export const getMaxMin = (
  minOrMax: 'min' | 'max',
  limits: SwapUserLimitsType,
  rate: RateType,
  payment: undefined | PaymentValue,
  BASE: SwapAccountType
) => {
  switch (minOrMax) {
    case 'max':
      const fiatMax = new BigNumber(
        convertBaseToStandard('FIAT', limits.maxPossibleOrder)
      )
      const cryptoMax = new BigNumber(
        convertStandardToBase(BASE.coin, fiatMax.dividedBy(rate.last))
      )
      const userMax = payment ? payment.effectiveBalance : BASE.balance
      return convertBaseToStandard(
        BASE.coin,
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
    Number(
      getMaxMin('max', limits, rates[walletCurrency], payment, restProps.BASE)
    )
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
    Number(
      getMaxMin('min', limits, rates[walletCurrency], payment, restProps.BASE)
    )
    ? 'BELOW_MIN'
    : false
}
