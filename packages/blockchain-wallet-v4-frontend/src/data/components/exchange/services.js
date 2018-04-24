
import { BigNumber } from 'bignumber.js'
import { Exchange } from 'blockchain-wallet-v4/src'
import { toLower } from 'ramda'

export const getPairFromCoin = (coinSource, coinTarget) => `${toLower(coinSource)}_${toLower(coinTarget)}`

export const getCoinFromPair = pair => {
  switch (pair) {
    case 'btc_eth': return { coinSource: 'BTC', targetCoin: 'ETH' }
    case 'btc_bch': return { coinSource: 'BTC', targetCoin: 'BCH' }
    case 'bch_btc': return { coinSource: 'BCH', targetCoin: 'BTC' }
    case 'bch_eth': return { coinSource: 'BCH', targetCoin: 'ETH' }
    case 'eth_btc': return { coinSource: 'ETH', targetCoin: 'BTC' }
    case 'eth_bch': return { coinSource: 'ETH', targetCoin: 'BCH' }
  }
}

export const convertBaseToStandard = (coin, value) => {
  switch (coin) {
    case 'BCH': return Exchange.convertBchToBch({ value, fromUnit: 'SAT', toUnit: 'BCH' }).value
    case 'BTC': return Exchange.convertBitcoinToBitcoin({ value, fromUnit: 'SAT', toUnit: 'BTC' }).value
    case 'ETH': return Exchange.convertEtherToEther({ value, fromUnit: 'WEI', toUnit: 'ETH' }).value
  }
}

export const getMinimum = (coin, minimum) => new BigNumber(minimum).toString()

export const getMaximum = (coin, maximum, effectiveBalance) => {
  const effectiveBalanceStandard = convertBaseToStandard(coin, effectiveBalance)
  const maximumBig = new BigNumber(maximum)
  const effectiveBalanceBig = new BigNumber(effectiveBalanceStandard)
  return maximumBig.lessThanOrEqualTo(effectiveBalanceBig) ? maximumBig.toString() : effectiveBalanceBig.toString()
}
