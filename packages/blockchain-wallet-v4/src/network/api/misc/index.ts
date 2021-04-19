import { Moment } from 'moment'

import { CoinType, FiatType } from 'core/types'

import { PriceIndexResponseType } from './types'

export default ({ apiUrl, get, post, rootUrl }) => {
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

  const getPriceIndex = (
    base: CoinType,
    quote: FiatType,
    time: Moment
  ): PriceIndexResponseType =>
    get({
      url: apiUrl,
      endPoint: '/price/index',
      data: { base, quote, time: time.unix() }
    })

  const getPriceIndexSeries = (coin, currency, start, scale) =>
    get({
      url: apiUrl,
      endPoint: '/price/index-series',
      data: { base: coin, quote: currency, start: start, scale: scale }
    })

  const getPriceTimestampSeries = (coin, currency, txTimestampList) =>
    post({
      url: apiUrl,
      endPoint: `/price/index-series?base=${coin}&quote=${currency}`,
      contentType: 'application/json',
      removeDefaultPostData: true,
      data: txTimestampList
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
    getPriceIndex,
    getPriceIndexSeries,
    getPriceTimestampSeries,
    getRandomBytes,
    getWalletNUsers
  }
}
