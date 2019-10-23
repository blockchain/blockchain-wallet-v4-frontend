import { equals, toUpper } from 'ramda'

export default ({ rootUrl, apiUrl, get, post }) => {
  const getCaptchaImage = (timestamp, sessionToken) =>
    get({
      url: rootUrl,
      endPoint: '/kaptcha.jpg',
      responseType: 'blob',
      data: { timestamp },
      sessionToken
    })

  const getLogs = (guid, sharedKey) =>
    post({
      url: rootUrl,
      endPoint: '/wallet',
      data: { guid, sharedKey, method: 'list-logs', format: 'json' }
    })

  const getPriceIndexSeries = (coin, currency, start, scale) =>
    get({
      url: apiUrl,
      endPoint: '/price/index-series',
      data: { base: coin, quote: currency, start: start, scale: scale }
    })

  const getRandomBytes = (bytes, format) =>
    get({
      url: apiUrl,
      endPoint: '/v2/randombytes',
      data: { bytes, format }
    })

  const getWalletNUsers = () =>
    get({
      url: apiUrl,
      ignoreQueryParams: true,
      endPoint: '/charts/my-wallet-n-users?cors=true'
    })

  return {
    getCaptchaImage,
    getLogs,
    getPriceIndexSeries,
    getRandomBytes,
    getWalletNUsers
  }
}
