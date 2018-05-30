import { BigNumber } from 'bignumber.js'
import { Exchange } from 'blockchain-wallet-v4/src'
import { isNil, toLower, path, prop } from 'ramda'

export const getPairFromCoin = (coinSource, coinTarget) => `${toLower(coinSource)}_${toLower(coinTarget)}`

export const getCoinFromPair = pair => {
  switch (pair) {
    case 'btc_eth': return { coinSource: 'BTC', targetCoin: 'ETH' }
    case 'btc_bch': return { coinSource: 'BTC', targetCoin: 'BCH' }
    case 'bch_btc': return { coinSource: 'BCH', targetCoin: 'BTC' }
    case 'bch_eth': return { coinSource: 'BCH', targetCoin: 'ETH' }
    case 'eth_btc': return { coinSource: 'ETH', targetCoin: 'BTC' }
    case 'eth_bch': return { coinSource: 'ETH', targetCoin: 'BCH' }
    default: throw new Error('Could not retrieve coins from pair.')
  }
}

export const convertCoinToFiat = (value, fromCoin, fromUnit, toCurrency, rates) => {
  switch (fromCoin) {
    case 'BCH': return Exchange.convertBchToFiat({ value, fromUnit, toCurrency, rates })
    case 'BTC': return Exchange.convertBitcoinToFiat({ value, fromUnit, toCurrency, rates })
    case 'ETH': return Exchange.convertEtherToFiat({ value, fromUnit, toCurrency, rates })
    default: throw new Error('Could not convert coin to fiat.')
  }
}

export const convertFiatToCoin = (value, fromCurrency, toCoin, toUnit, rates) => {
  switch (toCoin) {
    case 'BCH': return Exchange.convertFiatToBch({ value, fromCurrency, toUnit, rates })
    case 'BTC': return Exchange.convertFiatToBitcoin({ value, fromCurrency, toUnit, rates })
    case 'ETH': return Exchange.convertFiatToEther({ value, fromCurrency, toUnit, rates })
    default: throw new Error('Could not convert fiat to coin.')
  }
}

export const convertBaseToStandard = (coin, value) => {
  switch (coin) {
    case 'BCH': return Exchange.convertBchToBch({ value, fromUnit: 'SAT', toUnit: 'BCH' }).value
    case 'BTC': return Exchange.convertBitcoinToBitcoin({ value, fromUnit: 'SAT', toUnit: 'BTC' }).value
    case 'ETH': return Exchange.convertEtherToEther({ value, fromUnit: 'WEI', toUnit: 'ETH' }).value
    default: throw new Error('Could not convert coin to base.')
  }
}

export const convertStandardToBase = (coin, value) => {
  switch (coin) {
    case 'BCH': return Exchange.convertBchToBch({ value, fromUnit: 'BCH', toUnit: 'SAT' }).value
    case 'BTC': return Exchange.convertBitcoinToBitcoin({ value, fromUnit: 'BTC', toUnit: 'SAT' }).value
    case 'ETH': return Exchange.convertEtherToEther({ value, fromUnit: 'ETH', toUnit: 'WEI' }).value
    default: throw new Error('Could not convert base to coin.')
  }
}

export const getEffectiveBalance = (effectiveBalance) => {
  return new BigNumber(effectiveBalance).toString()
}

export const getMinimum = (coin, minimum) => {
  const minimumBase = convertStandardToBase(coin, minimum)
  return new BigNumber(minimumBase).toString()
}

export const getMaximum = (coin, maximum, effectiveBalance) => {
  const maximumBase = convertStandardToBase(coin, maximum)
  const effectiveBalanceB = new BigNumber(effectiveBalance)
  const maximumB = new BigNumber(maximumBase)
  return maximumB.lessThanOrEqualTo(effectiveBalanceB) ? maximumB.toString() : effectiveBalanceB.toString()
}

export const getMinimumStandard = (minimum) => {
  return new BigNumber(minimum).toString()
}

export const getEffectiveBalanceStandard = (coin, effectiveBalance) => {
  const effectiveBalanceStandard = convertBaseToStandard(coin, effectiveBalance)
  return new BigNumber(effectiveBalanceStandard).toString()
}

export const getMaximumStandard = (coin, maximum, effectiveBalance) => {
  const maximumB = new BigNumber(maximum)
  const effectiveBalanceStandard = getEffectiveBalanceStandard(coin, effectiveBalance)
  const effectiveBalanceB = new BigNumber(effectiveBalanceStandard)
  return maximumB.lessThanOrEqualTo(effectiveBalanceB) ? maximumB.toString() : effectiveBalanceB.toString()
}

export const isAmountBelowMinimum = (value, minimum) => {
  return new BigNumber(value).lessThan(new BigNumber(minimum))
}

export const isAmountAboveMaximum = (value, maximum) => {
  return new BigNumber(value).greaterThan(new BigNumber(maximum))
}

export const isUndefinedOrEqualsToZero = (value) => {
  const amount = value || 0
  return new BigNumber(amount).equals(new BigNumber(0))
}

export const isMinimumGreaterThanMaximum = (minimum, maximum) => {
  return new BigNumber(minimum).greaterThan(new BigNumber(maximum))
}

export const calculateFinalAmount = (value, fee) => {
  return new BigNumber(value).add(new BigNumber(fee)).toString()
}

export const selectFee = (coin, payment) => {
  switch (coin) {
    case 'BCH': return path(['selection', 'fee'], payment)
    case 'BTC': return path(['selection', 'fee'], payment)
    case 'ETH': return prop('fee', payment)
  }
}
