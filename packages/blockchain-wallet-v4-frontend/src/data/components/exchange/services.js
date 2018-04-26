
import { BigNumber } from 'bignumber.js'
import { Exchange } from 'blockchain-wallet-v4/src'
import { toLower, path, prop } from 'ramda'

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

export const getMinimum = (coin, minimum) => new BigNumber(minimum).toString()

export const getMaximum = (coin, maximum, effectiveBalance) => {
  const effectiveBalanceStandard = convertBaseToStandard(coin, effectiveBalance)
  const maximumBig = new BigNumber(maximum)
  const effectiveBalanceBig = new BigNumber(effectiveBalanceStandard)
  return maximumBig.lessThanOrEqualTo(effectiveBalanceBig) ? maximumBig.toString() : effectiveBalanceBig.toString()
}

export const isAmountAboveMinimum = (value, minimum) => {
  return new BigNumber(value).greaterThanOrEqualTo(new BigNumber(minimum))
}

export const isAmountBelowMaximum = (value, maximum) => {
  return new BigNumber(value).lessThanOrEqualTo(new BigNumber(maximum))
}

export const isEqualsToZero = (value) => {
  return new BigNumber(value).equals(new BigNumber(0))
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

// export const getLabel = (coin, source) => {
//   switch (coin) {
//     case 'BCH': return selectors.core.kvStore.bch.getAccountLabel(state)(target.accountIndex).getOrElse(target.address)
//     case 'BTC': return path(['selection', 'fee'], payment)
//     case 'ETH': return prop('fee', payment)
//   }
// } 
