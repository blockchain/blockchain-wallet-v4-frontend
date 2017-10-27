import { gt, toUpper, toLower } from 'ramda'

export default ({ rootUrl, apiUrl, get, post }) => {
  const getBitcoinTicker = () => get({
    url: rootUrl,
    endPoint: 'ticker',
    data: { format: 'json' }
  })

  const getCaptchaImage = (timestamp, sessionToken) => get({
    url: rootUrl,
    endPoint: 'kaptcha.jpg',
    data: { timestamp },
    sessionToken
  })

  const getUnspents = (fromAddresses, confirmations = 0) => get({
    url: rootUrl,
    endPoint: 'unspent',
    data: {
      active: fromAddresses.join('|'),
      confirmations: gt(confirmations, -1) ? confirmations : -1,
      format: 'json'
    }
  })

  const getFee = () => get({
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

  const getTransactionHistory = (active, currency, start, end) => post({
    url: rootUrl,
    endPoint: 'v2/export-history',
    data: { active, currency: toUpper(currency), start, end }
  })

  const getAdverts = number => get({
    url: apiUrl,
    endPoint: 'bci-ads/get',
    data: { wallet: true, n: number }
  })

  const getLogs = (guid, sharedKey) => post({
    url: rootUrl,
    endPoint: 'wallet',
    data: { guid, sharedKey, method: 'list-logs', format: 'json' }
  })

  const getPriceIndexSeries = (coin, currency, start, scale) => get({
    url: apiUrl,
    endPoint: 'price/index-series',
    data: { base: toLower(coin), quote: toLower(currency), start: start, scale: scale }
  })

  return {
    getBitcoinTicker,
    getCaptchaImage,
    getUnspents,
    getFee,
    pushTx,
    getTransactionFiatAtTime,
    getTransactionHistory,
    getAdverts,
    getLogs,
    getPriceIndexSeries
  }
}
