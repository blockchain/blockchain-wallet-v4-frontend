import { gt, toUpper } from 'ramda'

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
      confirmations: gt(confirmations, -1) ? confirmations : -1,
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

  const getTransactionFiatAtTime = (coin, amount, currency, time) => get({
    url: apiUrl,
    endPoint: coin === 'bitcoin' ? 'frombtc' : 'frometh',
    data: { value: amount, currency: toUpper(currency), time, textual: false, nosavecurrency: true }
  })

  return {
    getBitcoinTicker,
    getBitcoinUnspents,
    getBitcoinFee,
    pushTx,
    getTransactionFiatAtTime
  }
}
