import BigNumber from 'bignumber.js'

import { Exchange } from 'blockchain-wallet-v4/src'
import {
  PaymentValue,
  RateType,
  SwapQuoteType,
  SwapUserLimitsType
} from 'blockchain-wallet-v4/src/types'
import {
  convertBaseToStandard,
  convertStandardToBase
} from 'data/components/exchange/services'
import { SwapAccountType, SwapAmountFormValues } from 'data/types'
import { CRYPTO_DECIMALS } from 'services/forms'

import { Props } from '.'

export const getMaxMin = (
  minOrMax: 'min' | 'max',
  limits: SwapUserLimitsType,
  baseRate: RateType,
  payment: undefined | PaymentValue,
  quote: { quote: SwapQuoteType; rate: number },
  BASE: SwapAccountType,
  COUNTER: SwapAccountType
) => {
  switch (minOrMax) {
    case 'max':
      const fiatMax = new BigNumber(
        convertBaseToStandard('FIAT', limits.maxPossibleOrder)
      )
      const cryptoMax = new BigNumber(
        convertStandardToBase(BASE.coin, fiatMax.dividedBy(baseRate.last))
      )
      const userMax = Number(payment ? payment.effectiveBalance : BASE.balance)
      return convertBaseToStandard(
        BASE.coin,
        Math.min(userMax, cryptoMax.toNumber())
      )
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
      const baseMin = new BigNumber(fiatMin).dividedBy(baseRate.last).toNumber()

      // calculate the BTC -> ETH rate
      // 1 BTC = 39.12444194 ETH
      const exRate = new BigNumber(1).dividedBy(quote.rate)
      // BTC fee is 0.0004517 BTC a.k.a 4517 satoshi
      const standardCounterFee = convertBaseToStandard(
        COUNTER.coin,
        quote.quote.networkFee
      )
      // 4517 satoshi is 0.017672510 ETH is 7 USD (AOTW)
      const counterFeeInBase = exRate.times(standardCounterFee).toNumber()

      // We add 7 USD to 3.5 USD so worst case user receives 3.5 USD of BTC
      return (counterFeeInBase + baseMin).toPrecision(CRYPTO_DECIMALS)
  }
}

export const maximumAmount = (
  value: string,
  allValues: SwapAmountFormValues,
  restProps: Props
) => {
  if (!value) return true
  if (!allValues) return

  // @ts-ignore
  const { baseRates, fix, limits, payment, quote, walletCurrency } = restProps

  const cryptoMax = Number(
    getMaxMin(
      'max',
      limits,
      baseRates[walletCurrency],
      payment,
      quote,
      restProps.BASE,
      restProps.COUNTER
    )
  )
  const fiatMax = Exchange.convertCoinToFiat(
    cryptoMax,
    restProps.BASE.coin,
    walletCurrency,
    baseRates
  )
  return Number(value) > (fix === 'CRYPTO' ? cryptoMax : fiatMax)
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

  // @ts-ignore
  const { baseRates, fix, limits, payment, quote, walletCurrency } = restProps

  const cryptoMin = Number(
    getMaxMin(
      'min',
      limits,
      baseRates[walletCurrency],
      payment,
      quote,
      restProps.BASE,
      restProps.COUNTER
    )
  )
  const fiatMin = Exchange.convertCoinToFiat(
    cryptoMin,
    restProps.BASE.coin,
    walletCurrency,
    baseRates
  )

  return Number(value) < (fix === 'CRYPTO' ? cryptoMin : fiatMin)
    ? 'BELOW_MIN'
    : false
}

export const maximumAmountSilver = (
  restProps: Props,
  amtError: string | boolean
) => {
  // @ts-ignore
  const { limits, userData } = restProps
  if (userData.tiers.current === 2) return
  if (
    userData.tiers.current === 1 &&
    amtError === 'ABOVE_MAX' &&
    limits.maxPossibleOrder < limits.maxOrder
  )
    return true
}

export const incomingAmountNonZero = (value, allValues, restProps: Props) => {
  const { incomingAmount } = restProps
  return incomingAmount.isNegative ? 'NEGATIVE_INCOMING_AMT' : false
}
