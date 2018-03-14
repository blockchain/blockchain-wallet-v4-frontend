import moment from 'moment'
import { assoc, compose, path, prop } from 'ramda'

export const formatTrade = trade => {
  const { sourceCoin, targetCoin } = getCoinFromPair(path(['quote', 'pair'], trade))
  const timestamp = prop('timestamp', trade)
  return compose(
    assoc('date', moment(timestamp).format('DD MMMM YYYY, HH:mm')),
    assoc('sourceCoin', sourceCoin),
    assoc('targetCoin', targetCoin)
  )(trade)
}

export const getPairFromCoin = (sourceCoin, targetCoin) => {
  switch (sourceCoin) {
    case 'BTC': {
      switch (targetCoin) {
        case 'ETH': return 'btc_eth'
        case 'BCH': return 'btc_bch'
        default: return ''
      }
    }
    case 'BCH': {
      switch (targetCoin) {
        case 'BTC': return 'bch_btc'
        case 'ETH': return 'bch_eth'
        default: return ''
      }
    }
    case 'ETH': {
      switch (targetCoin) {
        case 'BTC': return 'eth_btc'
        case 'BCH': return 'eth_bch'
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
  }
}
