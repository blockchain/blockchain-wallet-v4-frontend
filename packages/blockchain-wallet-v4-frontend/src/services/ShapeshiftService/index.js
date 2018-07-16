import moment from 'moment'
import { assoc, compose, path, prop, toLower } from 'ramda'

export const formatTrade = trade => {
  const { sourceCoin, targetCoin } = getCoinFromPair(path(['quote', 'pair'], trade))
  const timestamp = prop('timestamp', trade)
  return compose(
    assoc('date', moment(timestamp).format('DD MMMM YYYY, HH:mm')),
    assoc('sourceCoin', sourceCoin),
    assoc('targetCoin', targetCoin)
  )(trade)
}

export const getPairFromCoin = (coinSource, coinTarget) => `${toLower(coinSource)}_${toLower(coinTarget)}`

export const getPairFromCoinCamel = (sourceCoin, targetCoin) => {
  switch (sourceCoin) {
    case 'BTC': {
      switch (targetCoin) {
        case 'ETH': return 'btcEth'
        case 'BCH': return 'btcBch'
        default: return ''
      }
    }
    case 'BCH': {
      switch (targetCoin) {
        case 'BTC': return 'bchBtc'
        case 'ETH': return 'bchEth'
        default: return ''
      }
    }
    case 'ETH': {
      switch (targetCoin) {
        case 'BTC': return 'ethBtc'
        case 'BCH': return 'ethBch'
        default: return ''
      }
    }
    default: return ''
  }
}

export const getCoinFromPair = pair => {
  switch (pair) {
    case 'btc_eth': return { sourceCoin: 'BTC', targetCoin: 'ETH' }
    case 'btc_bch': return { sourceCoin: 'BTC', targetCoin: 'BCH' }
    case 'bch_btc': return { sourceCoin: 'BCH', targetCoin: 'BTC' }
    case 'bch_eth': return { sourceCoin: 'BCH', targetCoin: 'ETH' }
    case 'eth_btc': return { sourceCoin: 'ETH', targetCoin: 'BTC' }
    case 'eth_bch': return { sourceCoin: 'ETH', targetCoin: 'BCH' }
    default: return { sourceCoin: '', targetCoin: '' }
  }
}
