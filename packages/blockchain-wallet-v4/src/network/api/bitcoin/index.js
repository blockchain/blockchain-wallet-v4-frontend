import { toUpper } from 'ramda'

export default ({ rootUrl, apiUrl, get, post }) => {
  const getBitcoinTicker = () => get({
    url: rootUrl,
    endPoint: 'ticker',
    data: { format: 'json' }
  })

  const getBitcoinUnspents = (fromAddresses, confirmations = 0) => get({
    url: rootUrl,
    endPoint: 'unspent',
    data: {
      active: fromAddresses.join('|'),
      confirmations: Math.max(confirmations, -1),
      format: 'json'
    }
  })

  const getBitcoinFee = () => get({
    url: apiUrl,
    endPoint: 'mempool/fees'
  })

  const pushTx = (txHex) => post({
    url: rootUrl,
    endPoint: 'pushtx',
    data: { tx: txHex, format: 'plain' }
  })

  const getBitcoinFiatAtTime = (amount, currency, time) => get({
    url: apiUrl,
    endPoint: 'frombtc',
    data: { value: amount, currency: toUpper(currency), time, textual: false, nosavecurrency: true }
  })

  const getLatestBlock = () => get({
    url: rootUrl,
    endPoint: 'latestblock'
  })

  const getRawTx = (txHex) => get({
    url: rootUrl,
    endPoint: 'rawtx/' + txHex
  })

  return {
    getBitcoinTicker,
    getBitcoinUnspents,
    getBitcoinFee,
    pushTx,
    getBitcoinFiatAtTime,
    getLatestBlock,
    getRawTx
  }
}
