import { toUpper } from 'ramda'

export default ({ rootUrl, apiUrl, get, post }) => {
  const getCaptchaImage = (timestamp, sessionToken) => get({
    url: rootUrl,
    endPoint: 'kaptcha.jpg',
    data: { timestamp },
    sessionToken
  })

  const getTransactionHistory = (coin, active, currency, start, end) => {
    return coin === 'BCH'
      ? get({
        url: apiUrl,
        endPoint: 'bch/v2/export-history',
        data: { active, currency: toUpper(currency), start, end }
      }) : post({
        url: rootUrl,
        endPoint: 'v2/export-history',
        data: { active, currency: toUpper(currency), start, end }
      })
  }

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
    data: { base: coin, quote: currency, start: start, scale: scale }
  })

  const getRandomBytes = (bytes, format) => get({
    url: apiUrl,
    endPoint: 'v2/randombytes',
    data: { bytes, format }
  })

  return {
    getCaptchaImage,
    getTransactionHistory,
    getAdverts,
    getLogs,
    getPriceIndexSeries,
    getRandomBytes
  }
}
