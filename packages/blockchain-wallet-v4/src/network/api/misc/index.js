import { toUpper } from 'ramda'

export default ({ get, post }) => {
  const getCaptchaImage = (timestamp, sessionToken) => get({
    url: global.domains.root,
    endPoint: 'kaptcha.jpg',
    data: { timestamp },
    sessionToken
  })

  const getTransactionHistory = (coin, active, currency, start, end) => {
    return coin === 'BCH'
      ? get({
        url: global.domains.api,
        endPoint: 'bch/v2/export-history',
        data: { active, currency: toUpper(currency), start, end }
      }) : post({
        url: global.domains.root,
        endPoint: 'v2/export-history',
        data: { active, currency: toUpper(currency), start, end }
      })
  }

  const getAdverts = number => get({
    url: global.domains.api,
    endPoint: 'bci-ads/get',
    data: { wallet: true, n: number }
  })

  const getLogs = (guid, sharedKey) => post({
    url: global.domains.root,
    endPoint: 'wallet',
    data: { guid, sharedKey, method: 'list-logs', format: 'json' }
  })

  const getPriceIndexSeries = (coin, currency, start, scale) => get({
    url: global.domains.api,
    endPoint: 'price/index-series',
    data: { base: coin, quote: currency, start: start, scale: scale }
  })

  return {
    getCaptchaImage,
    getTransactionHistory,
    getAdverts,
    getLogs,
    getPriceIndexSeries
  }
}
