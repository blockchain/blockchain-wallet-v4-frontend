import { assoc, compose, curry, map, path, pathOr, prop } from 'ramda'
import { BigNumber } from 'bignumber.js'
import { Exchange } from 'blockchain-wallet-v4/src'

import {
  ANNUAL_ERROR,
  BALANCE_ERROR,
  DAILY_ERROR,
  MINIMUM_ERROR,
  MINIMUM_NO_LINK_ERROR,
  ORDER_ERROR,
  REACHED_ANNUAL_ERROR,
  REACHED_DAILY_ERROR,
  REACHED_WEEKLY_ERROR,
  WEEKLY_ERROR
} from './model'
import { CoinType } from 'core/types'
import { currencySymbolMap } from 'services/CoinifyService'
import { formatPair } from 'data/modules/rates/model'

export const convertBaseToStandard = (
  coin: CoinType | 'FIAT',
  value
): string => {
  return Exchange.convertCoinToCoin({ coin, value, baseToStandard: true }).value
}

export const convertStandardToBase = (
  coin: CoinType | 'FIAT',
  value
): string => {
  return Exchange.convertCoinToCoin({ coin, value, baseToStandard: false })
    .value
}

export const getEffectiveBalanceStandard = (coin, effectiveBalance) => {
  const effectiveBalanceStandard = convertBaseToStandard(coin, effectiveBalance)
  return new BigNumber(effectiveBalanceStandard).toString()
}

export const isAmountBelowMinimum = (value, minimum) => {
  return new BigNumber(value).isLessThan(new BigNumber(minimum))
}

export const isAmountAboveMaximum = (value, maximum) => {
  return maximum && new BigNumber(value).isGreaterThan(new BigNumber(maximum))
}

export const divide = curry((dividend, divisor, decimals = 8) => {
  return new BigNumber(dividend)
    .dividedBy(new BigNumber(divisor))
    .toFixed(decimals)
})

export const multiply = curry((multiplicand, multiplier, decimals = 8) => {
  return new BigNumber(multiplicand)
    .times(new BigNumber(multiplier))
    .toFixed(decimals)
})

export const toFixed = curry((decimals, roundDown, string) => {
  return new BigNumber(string).toFixed(decimals, roundDown ? 1 : undefined)
})

export const minimum = (val1, val2) => {
  return new BigNumber(val1).isLessThan(val2) ? val1 : val2
}

export const selectFee = (coin, payment) => {
  switch (coin) {
    case 'BCH':
      return path(['selection', 'fee'], payment)
    case 'BTC':
      return path(['selection', 'fee'], payment)
    case 'XLM':
      return prop('fee', payment)
    case 'ETH':
      return prop('fee', payment)
    default:
      return prop('fee', payment)
  }
}

export const validateMinMax = limits => {
  const minSymbol = path(['minOrder', 'symbol'], limits)
  const maxSymbol = path(['maxPossibleOrder', 'symbol'], limits)
  const minOrder = path(['minOrder', 'amount'], limits)
  const maxPossible = path(['maxPossibleOrder', 'amount'], limits)
  const dailyMax = path(['daily', 'amount', 'available'], limits)
  const weeklyMax = path(['weekly', 'amount', 'available'], limits)
  const annualMax = path(['annual', 'amount', 'available'], limits)

  if (minSymbol === maxSymbol && isAmountAboveMaximum(minOrder, maxPossible)) {
    if (isAmountAboveMaximum(minOrder, annualMax)) throw REACHED_ANNUAL_ERROR
    if (isAmountAboveMaximum(minOrder, weeklyMax)) throw REACHED_WEEKLY_ERROR
    if (isAmountAboveMaximum(minOrder, dailyMax)) throw REACHED_DAILY_ERROR
    throw MINIMUM_NO_LINK_ERROR
  }
}

export const validateVolume = (
  limits,
  sourceFiatVolume,
  sourceCryptoVolume
) => {
  const minOrder = path(['minOrder', 'amount'], limits)
  const balanceMax = path(['balanceMax', 'amount'], limits)
  const maxOrder = path(['maxOrder', 'amount'], limits)
  const dailyMax = path(['daily', 'amount', 'available'], limits)
  const weeklyMax = path(['weekly', 'amount', 'available'], limits)
  const annualMax = path(['annual', 'amount', 'available'], limits)

  if (isAmountBelowMinimum(sourceFiatVolume, minOrder)) throw MINIMUM_ERROR
  if (isAmountAboveMaximum(sourceCryptoVolume, balanceMax)) throw BALANCE_ERROR
  if (isAmountAboveMaximum(sourceFiatVolume, dailyMax)) throw DAILY_ERROR
  if (isAmountAboveMaximum(sourceFiatVolume, weeklyMax)) throw WEEKLY_ERROR
  if (isAmountAboveMaximum(sourceFiatVolume, annualMax)) throw ANNUAL_ERROR
  if (isAmountAboveMaximum(sourceFiatVolume, maxOrder)) throw ORDER_ERROR
}

export const addBalanceLimit = (balanceLimit, limits) => {
  const { fiatBalance, cryptoBalance } = balanceLimit

  const resultingLimits = assoc('balanceMax', cryptoBalance, limits)
  const maxFiatLimit = prop('maxFiatLimit', limits)

  if (
    new BigNumber(prop('amount', fiatBalance)).isLessThan(
      // @ts-ignore
      path(['minOrder', 'amount'], limits)
    )
  ) {
    return assoc('maxPossibleOrder', fiatBalance, resultingLimits)
  }

  if (
    new BigNumber(prop('amount', fiatBalance)).isLessThan(
      prop('amount', maxFiatLimit)
    )
  ) {
    return assoc('maxPossibleOrder', cryptoBalance, resultingLimits)
  }

  return assoc('maxPossibleOrder', maxFiatLimit, resultingLimits)
}

export const formatLimits = ({ currency, ...limits }) =>
  compose<any>(
    map(limit => ({
      amount: limit,
      fiat: true,
      symbol: currencySymbolMap[currency]
    })),
    // @ts-ignore
    assoc('maxFiatLimit', limits.maxPossibleOrder)
  )(limits)

const getRate = (rates, source, target) => {
  const pathTo = prop(target, rates)
    ? [target, 'last']
    : [formatPair(source, target), 'price']
  return compose(
    (rate: number) => new BigNumber(rate).toFixed(14),
    pathOr(0, pathTo)
  )(rates)
}

export const convertSourceToTarget = (form, rates, amount) => {
  const sourceCoin = path(['source', 'coin'], form)
  const targetCoin = path(['target', 'coin'], form)

  return compose<any>(
    toFixed(8, false),
    // @ts-ignore
    multiply(getRate(rates, targetCoin, sourceCoin))
  )(amount)
}

export const convertSourceFeesToFiat = (
  form,
  fiatCurrency,
  rates,
  amount,
  isSourceErc20,
  fallbackEthRates
) => {
  const sourceCoin = isSourceErc20 ? 'ETH' : path(['source', 'coin'], form)
  const sourceRates = isSourceErc20 ? fallbackEthRates : rates

  return compose<any>(
    toFixed(2, false),
    // @ts-ignore
    multiply(getRate(sourceRates, sourceCoin, fiatCurrency))
  )(amount)
}
