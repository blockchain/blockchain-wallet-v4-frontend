import queryString from 'query-string'
import { gt, toUpper, toLower } from 'ramda'

export default ({ rootUrl, apiUrl, apiCode }) => {
  const get = function (url, endPoint, data, sessionToken) {
    const formEncodedData = queryString.stringify({
      ...data,
      api_code: apiCode
    })

    const headers = sessionToken
      ? { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': sessionToken }
      : { 'Content-Type': 'application/x-www-form-urlencoded' }

    const options = {
      method: 'GET',
      headers,
      credentials: 'omit'
    }

    return fetch(`${url}wallet/${endPoint}?${formEncodedData}`, options)
  }

  const post = function (url, endPoint, data, sessionToken) {
    const formEncodedData = queryString.stringify({
      ...data,
      api_code: apiCode
    })

    const headers = sessionToken
      ? { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': sessionToken }
      : { 'Content-Type': 'application/x-www-form-urlencoded' }

    const options = {
      method: 'GET',
      headers,
      credentials: 'omit',
      body: formEncodedData
    }

    return fetch(`${rootUrl}wallet/${endPoint}`, options)
  }

  const getBitcoinTicker = () => get(rootUrl, 'ticker', { format: 'json' })

  const getEthereumTicker = () => get(rootUrl, 'ticker', { format: 'json', currency: 'USD', base: 'ETH' })

  const getCaptchaImage = (timestamp, sessionToken) => get(rootUrl, 'kaptcha.jpg', { timestamp }, sessionToken)

  const getUnspents = function (fromAddresses, confirmations = 0) {
    const data = {
      active: fromAddresses.join('|'),
      confirmations: gt(confirmations, -1) ? confirmations : -1,
      format: 'json'
    }
    return post(rootUrl, 'unspent', data)
  }

  const getFee = () => get(apiUrl, 'mempool/fees')

  const pushTx = (txHex) => post(rootUrl, 'pushtx', { tx: txHex, format: 'plain' })

  const getTransactionFiatAtTime = (coin, amount, currency, time) => {
    switch (coin) {
      case 'bitcoin': return get(apiUrl, 'frombtc', { value: amount, currency: toUpper(currency), time, textual: false, nosavecurrency: true })
      case 'ethereum': return get(apiUrl, 'frometh', { value: amount, currency: toUpper(currency), time, textual: false, nosavecurrency: true })
    }
  }

  const getTransactionHistory = (active, currency, start, end) => post(rootUrl, 'v2/export-history', { active, currency: toUpper(currency), start, end })

  const getAdverts = (number) => get(apiUrl, 'bci-ads/get', { wallet: true, n: number })

  const getLogs = (guid, sharedKey) => post(rootUrl, 'wallet', { guid, sharedKey, method: 'list-logs', format: 'json' })

  const getPriceIndexSeries = (coin, currency, start, scale) => get(apiUrl, 'price/index-series', { base: toLower(coin), quote: toLower(currency), start: start, scale: scale })

  return {
    getBitcoinTicker,
    getEthereumTicker,
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
