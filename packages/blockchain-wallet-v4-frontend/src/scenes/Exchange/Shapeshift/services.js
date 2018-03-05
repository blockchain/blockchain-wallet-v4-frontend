export const getPairFromCoin = (coinSource, coinTarget) => {
  switch (coinSource) {
    case 'BTC': {
      switch (coinTarget) {
        case 'ETH': return 'btc_eth'
        case 'BCH': return 'btc_bch'
        default: return ''
      }
    }
    case 'BCH': {
      switch (coinTarget) {
        case 'BTC': return 'bch_btc'
        case 'ETH': return 'bch_eth'
        default: return ''
      }
    }
    case 'ETH': {
      switch (coinTarget) {
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
    case 'btc_eth': return { coinSource: 'BTC', targetCoin: 'ETH' }
    case 'btc_bch': return { coinSource: 'BTC', targetCoin: 'BCH' }
    case 'bch_btc': return { coinSource: 'BCH', targetCoin: 'BTC' }
    case 'bch_eth': return { coinSource: 'BCH', targetCoin: 'ETH' }
    case 'eth_btc': return { coinSource: 'ETH', targetCoin: 'BTC' }
    case 'eth_bch': return { coinSource: 'ETH', targetCoin: 'BCH' }
  }
}
