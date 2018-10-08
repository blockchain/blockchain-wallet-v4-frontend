import { BigNumber } from 'bignumber.js'
import { Exchange } from 'blockchain-wallet-v4/src'
import {
  assoc,
  compose,
  curry,
  path,
  pathOr,
  prop,
  reduce,
  toLower
} from 'ramda'

import { formatPair, FIX_TYPES } from 'data/modules/rates/model'
import {
  MINIMUM_NO_LINK_ERROR,
  // REACHED_DAILY_ERROR,
  // REACHED_WEEKLY_ERROR,
  // REACHED_ANNUAL_ERROR,
  MINIMUM_ERROR,
  BALANCE_ERROR,
  // DAILY_ERROR,
  // WEEKLY_ERROR,
  // ANNUAL_ERROR,
  ORDER_ERROR
} from './model'
const { BASE, BASE_IN_FIAT, COUNTER, COUNTER_IN_FIAT } = FIX_TYPES

export const getPairFromCoin = (coinSource, coinTarget) =>
  `${toLower(coinSource)}_${toLower(coinTarget)}`

export const getCoinFromPair = pair => {
  switch (pair) {
    case 'btc_eth':
      return { coinSource: 'BTC', targetCoin: 'ETH' }
    case 'btc_bch':
      return { coinSource: 'BTC', targetCoin: 'BCH' }
    case 'bch_btc':
      return { coinSource: 'BCH', targetCoin: 'BTC' }
    case 'bch_eth':
      return { coinSource: 'BCH', targetCoin: 'ETH' }
    case 'eth_btc':
      return { coinSource: 'ETH', targetCoin: 'BTC' }
    case 'eth_bch':
      return { coinSource: 'ETH', targetCoin: 'BCH' }
    default:
      throw new Error('Could not retrieve coins from pair.')
  }
}

export const convertCoinToFiat = (
  value,
  fromCoin,
  fromUnit,
  toCurrency,
  rates
) => {
  switch (fromCoin) {
    case 'BCH':
      return Exchange.convertBchToFiat({ value, fromUnit, toCurrency, rates })
    case 'BTC':
      return Exchange.convertBitcoinToFiat({
        value,
        fromUnit,
        toCurrency,
        rates
      })
    case 'ETH':
      return Exchange.convertEtherToFiat({
        value,
        fromUnit,
        toCurrency,
        rates
      })
    default:
      throw new Error('Could not convert coin to fiat.')
  }
}

export const convertFiatToCoin = (
  value,
  fromCurrency,
  toCoin,
  toUnit,
  rates
) => {
  switch (toCoin) {
    case 'BCH':
      return Exchange.convertFiatToBch({ value, fromCurrency, toUnit, rates })
    case 'BTC':
      return Exchange.convertFiatToBitcoin({
        value,
        fromCurrency,
        toUnit,
        rates
      })
    case 'ETH':
      return Exchange.convertFiatToEther({
        value,
        fromCurrency,
        toUnit,
        rates
      })
    default:
      throw new Error('Could not convert fiat to coin.')
  }
}

export const convertBaseToStandard = (coin, value) => {
  switch (coin) {
    case 'BCH':
      return Exchange.convertBchToBch({ value, fromUnit: 'SAT', toUnit: 'BCH' })
        .value
    case 'BTC':
      return Exchange.convertBitcoinToBitcoin({
        value,
        fromUnit: 'SAT',
        toUnit: 'BTC'
      }).value
    case 'ETH':
      return Exchange.convertEtherToEther({
        value,
        fromUnit: 'WEI',
        toUnit: 'ETH'
      }).value
    default:
      throw new Error('Could not convert coin to base.')
  }
}

export const convertStandardToBase = (coin, value) => {
  switch (coin) {
    case 'BCH':
      return Exchange.convertBchToBch({ value, fromUnit: 'BCH', toUnit: 'SAT' })
        .value
    case 'BTC':
      return Exchange.convertBitcoinToBitcoin({
        value,
        fromUnit: 'BTC',
        toUnit: 'SAT'
      }).value
    case 'ETH':
      return Exchange.convertEtherToEther({
        value,
        fromUnit: 'ETH',
        toUnit: 'WEI'
      }).value
    default:
      throw new Error('Could not convert base to coin.')
  }
}

export const getEffectiveBalance = effectiveBalance => {
  return new BigNumber(effectiveBalance).toString()
}

export const getMinimum = shapeshiftMinimum =>
  new BigNumber(shapeshiftMinimum).toString()

export const getMaximum = (
  shapeshiftMaximum,
  effectiveBalance,
  regulationLimit
) => {
  const shapeshiftMaximumB = new BigNumber(shapeshiftMaximum)
  const effectiveBalanceB = new BigNumber(effectiveBalance)
  const regulationLimitB = new BigNumber(regulationLimit)
  if (
    shapeshiftMaximumB.lessThanOrEqualTo(effectiveBalanceB) &&
    shapeshiftMaximumB.lessThanOrEqualTo(regulationLimitB)
  ) {
    return shapeshiftMaximumB.toString()
  } else if (
    effectiveBalanceB.lessThanOrEqualTo(shapeshiftMaximumB) &&
    effectiveBalanceB.lessThanOrEqualTo(regulationLimitB)
  ) {
    return effectiveBalanceB.toString()
  } else {
    return regulationLimitB.toString()
  }
}

export const getMinimumStandard = minimum => {
  return new BigNumber(minimum).toString()
}

export const getEffectiveBalanceStandard = (coin, effectiveBalance) => {
  const effectiveBalanceStandard = convertBaseToStandard(coin, effectiveBalance)
  return new BigNumber(effectiveBalanceStandard).toString()
}

export const getMaximumStandard = (coin, maximum, effectiveBalance) => {
  const maximumB = new BigNumber(maximum)
  const effectiveBalanceStandard = getEffectiveBalanceStandard(
    coin,
    effectiveBalance
  )
  const effectiveBalanceB = new BigNumber(effectiveBalanceStandard)
  return maximumB.lessThanOrEqualTo(effectiveBalanceB)
    ? maximumB.toString()
    : effectiveBalanceB.toString()
}

export const isAmountBelowMinimum = (value, minimum) => {
  return new BigNumber(value).lessThan(new BigNumber(minimum))
}

export const isAmountAboveMaximum = (value, maximum) => {
  return new BigNumber(value).greaterThan(new BigNumber(maximum))
}

export const isUndefinedOrEqualsToZero = value => {
  const amount = value || 0
  return new BigNumber(amount).equals(new BigNumber(0))
}

export const isMinimumGreaterThanMaximum = (minimum, maximum) => {
  return new BigNumber(minimum).greaterThan(new BigNumber(maximum))
}

export const calculateFinalAmount = (value, fee) => {
  return new BigNumber(value).add(new BigNumber(fee)).toString()
}

export const divide = curry((dividend, divisor, decimals = 8) => {
  return new BigNumber(dividend)
    .dividedBy(new BigNumber(divisor))
    .toFixed(decimals)
})

export const divideBy = curry((divisor, dividend) => divide(dividend, divisor))

export const multiply = curry((multiplicand, multiplier, decimals = 8) => {
  return new BigNumber(multiplicand)
    .times(new BigNumber(multiplier))
    .toFixed(decimals)
})

export const toFixed = curry((decimals, roundDown, string) => {
  return new BigNumber(string).toFixed(decimals, roundDown ? 1 : undefined)
})

export const minimum = (val1, val2) => {
  return new BigNumber(val1).lessThan(val2) ? val1 : val2
}

export const selectFee = (coin, payment) => {
  switch (coin) {
    case 'BCH':
      return path(['selection', 'fee'], payment)
    case 'BTC':
      return path(['selection', 'fee'], payment)
    case 'ETH':
      return prop('fee', payment)
  }
}

export const validateVolume = (limits, volume) => {
  const minOrder = prop('minOrder', limits)
  const maxPossible = prop('maxPossibleOrder', limits)
  const balanceMax = prop('balanceMax', limits)
  const maxOrder = prop('maxOrder', limits)
  // const dailyMax = path(['daily', 'available'], limits)
  // const weeklyMax = path(['weekly', 'available'], limits)
  // const annualMax = path(['annual', 'available'], limits)

  if (isAmountAboveMaximum(minOrder, maxPossible)) {
    // if (isAmountAboveMaximum(minOrder, annualMax)) throw REACHED_ANNUAL_ERROR
    // if (isAmountAboveMaximum(minOrder, weeklyMax)) throw REACHED_WEEKLY_ERROR
    // if (isAmountAboveMaximum(minOrder, dailyMax)) throw REACHED_DAILY_ERROR
    throw MINIMUM_NO_LINK_ERROR
  }
  if (isAmountBelowMinimum(volume, minOrder)) throw MINIMUM_ERROR
  if (isAmountAboveMaximum(volume, balanceMax)) throw BALANCE_ERROR
  // if (isAmountAboveMaximum(volume, dailyMax)) throw DAILY_ERROR
  // if (isAmountAboveMaximum(volume, weeklyMax)) throw WEEKLY_ERROR
  // if (isAmountAboveMaximum(volume, annualMax)) throw ANNUAL_ERROR
  if (isAmountAboveMaximum(volume, maxOrder)) throw ORDER_ERROR
}

const calcMaxPossibleOrder = limits =>
  assoc(
    'maxPossibleOrder',
    reduce(minimum, Infinity, [
      prop('balanceMax', limits),
      prop('maxOrder', limits)
      // path(['daily', 'available'], limits),
      // path(['weekly', 'available'], limits),
      // path(['annual', 'available'], limits)
    ]),
    limits
  )

export const addBalanceLimit = (fiatBalance, limits) =>
  compose(
    calcMaxPossibleOrder,
    assoc('balanceMax', fiatBalance)
  )(limits)

const getRate = (rates, source, target) =>
  compose(
    rate => new BigNumber(rate).toFixed(14),
    pathOr(0, [formatPair(source, target), 'price'])
  )(rates)

export const convertTargetToFiat = (form, fiatCurrency, rates, amount) => {
  const targetCoin = path(['target', 'coin'], form)

  return compose(
    toFixed(8, false),
    multiply(getRate(rates, targetCoin, fiatCurrency))
  )(amount)
}

export const convertSourceToTarget = (form, rates, amount) => {
  const sourceCoin = path(['source', 'coin'], form)
  const targetCoin = path(['target', 'coin'], form)

  return compose(
    toFixed(8, false),
    multiply(getRate(rates, targetCoin, sourceCoin))
  )(amount)
}

export const getCurrentMin = (form, fiatCurrency, rates, sourceFiatMin) => {
  const fix = prop('fix', form)
  const sourceCoin = path(['source', 'coin'], form)
  const targetCoin = path(['target', 'coin'], form)
  switch (fix) {
    case BASE_IN_FIAT:
      return toFixed(2, false, sourceFiatMin)
    case BASE:
      return compose(
        toFixed(8, false),
        multiply(getRate(rates, fiatCurrency, sourceCoin))
      )(sourceFiatMin)
    case COUNTER:
      return compose(
        toFixed(8, false),
        multiply(getRate(rates, fiatCurrency, sourceCoin)),
        multiply(getRate(rates, sourceCoin, targetCoin))
      )(sourceFiatMin)
    case COUNTER_IN_FIAT:
      return compose(
        toFixed(2, false),
        multiply(getRate(rates, fiatCurrency, sourceCoin)),
        multiply(getRate(rates, sourceCoin, targetCoin)),
        multiply(getRate(rates, targetCoin, fiatCurrency))
      )(sourceFiatMin)
  }
}

export const getCurrentMax = (form, fiatCurrency, rates, sourceFiatMax) => {
  const fix = prop('fix', form)
  const sourceCoin = path(['source', 'coin'], form)
  const targetCoin = path(['target', 'coin'], form)
  switch (fix) {
    case BASE_IN_FIAT:
      return toFixed(2, true, sourceFiatMax)
    case BASE:
      return compose(
        toFixed(8, true),
        divideBy(getRate(rates, sourceCoin, fiatCurrency))
      )(sourceFiatMax)
    case COUNTER:
      return compose(
        toFixed(8, true),
        divideBy(getRate(rates, sourceCoin, fiatCurrency)),
        divideBy(getRate(rates, targetCoin, sourceCoin))
      )(sourceFiatMax)
    case COUNTER_IN_FIAT:
      return compose(
        toFixed(2, true),
        divideBy(getRate(rates, sourceCoin, fiatCurrency)),
        divideBy(getRate(rates, targetCoin, sourceCoin)),
        divideBy(getRate(rates, fiatCurrency, targetCoin))
      )(sourceFiatMax)
  }
}
