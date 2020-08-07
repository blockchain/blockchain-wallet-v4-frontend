import BigNumber from 'bignumber.js'

import { convertBaseToStandard } from 'data/components/exchange/services'
import { CRYPTO_DECIMALS } from 'services/ValidationHelper'
import {
  getCoinFromPair,
  getFiatFromPair
} from 'data/components/simpleBuy/model'
import { Props } from './template.success'
import {
  RatesType,
  SBBalancesType,
  SBOrderActionType,
  SBPairType,
  SBPaymentMethodType
} from 'core/types'
import { SBCheckoutFormValuesType } from 'data/types'

export const getMaxMin = (
  pair: SBPairType,
  minOrMax: 'min' | 'max',
  sbBalances: SBBalancesType,
  orderType: SBOrderActionType,
  rates: RatesType,
  allValues?: SBCheckoutFormValuesType,
  method?: SBPaymentMethodType
) => {
  switch (orderType) {
    case 'BUY':
      switch (minOrMax || 'max') {
        case 'max':
          const defaultMax = convertBaseToStandard('FIAT', 0)
          if (!allValues) return defaultMax
          if (!method) return defaultMax
          if (!pair) return defaultMax

          let max = BigNumber.minimum(method.limits.max, pair.buyMax).toString()

          if (method.type === 'FUNDS' && sbBalances)
            max = sbBalances[method.currency]?.available || '0'

          return convertBaseToStandard('FIAT', max)
        case 'min':
          const defaultMin = convertBaseToStandard('FIAT', 0)
          if (!allValues) return defaultMin
          if (!method) return defaultMin
          if (!pair) return defaultMin

          const min = BigNumber.maximum(
            method.limits.min,
            pair.buyMin
          ).toString()

          return convertBaseToStandard('FIAT', min)
      }
      break
    case 'SELL':
      const coin = getCoinFromPair(pair.pair)
      const fiat = getFiatFromPair(pair.pair)
      const rate = rates[fiat].last
      switch (minOrMax) {
        case 'max':
          const maxAvailable = sbBalances[coin]?.available || '0'

          return convertBaseToStandard(coin, maxAvailable)
        case 'min':
          const minStandard = convertBaseToStandard(
            'FIAT',
            new BigNumber(pair.sellMin)
          )
          return new BigNumber(minStandard)
            .dividedBy(rate)
            .toFixed(CRYPTO_DECIMALS)
      }
  }
}

export const maximumAmount = (
  value: string,
  allValues: SBCheckoutFormValuesType,
  restProps: Props
) => {
  if (!value) return true

  const {
    orderType,
    pair,
    rates,
    method: selectedMethod,
    defaultMethod,
    sbBalances
  } = restProps
  const method = selectedMethod || defaultMethod
  if (!method) return

  return Number(value) >
    Number(
      getMaxMin(pair, 'max', sbBalances, orderType, rates, allValues, method)
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
    orderType,
    pair,
    rates,
    method: selectedMethod,
    defaultMethod,
    sbBalances
  } = restProps
  const method = selectedMethod || defaultMethod
  if (!method) return

  return Number(value) <
    Number(
      getMaxMin(pair, 'min', sbBalances, orderType, rates, allValues, method)
    )
    ? 'BELOW_MIN'
    : false
}
