import { Moment } from 'moment'
import { equals, toUpper } from 'ramda'

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

  const getTransactionHistory = (coin, active, currency, start, end) => {
    const isBCH = equals(coin, 'BCH')
    const endpoint = '/v2/export-history'
    return post({
      url: isBCH ? apiUrl : rootUrl,
      endPoint: isBCH ? '/bch' + endpoint : endpoint,
      data: { active, currency: toUpper(currency), start, end }
    })
  }

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
    getTransactionHistory,
    getLogs,
    getPriceIndex,
    getPriceIndexSeries,
    getPriceTimestampSeries,
    getRandomBytes,
    getWalletNUsers
  }
}
