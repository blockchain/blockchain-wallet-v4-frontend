import { Moment } from 'moment'

import { CoinType, FiatType } from 'core/types'

import { PriceIndexResponseType } from './types'

export default ({ apiUrl, get, post }) => {
  const getPriceIndex = (base: CoinType, quote: FiatType, time: Moment): PriceIndexResponseType =>
    get({
      data: { base, quote, time: time.unix() },
      endPoint: '/price/index',
      url: apiUrl
    })

  const getPriceIndexSeries = (coin, currency, start, scale) =>
    get({
      data: { base: coin, quote: currency, scale, start },
      endPoint: '/price/index-series',
      url: apiUrl
    })

  const getPriceTimestampSeries = (coin, currency, txTimestampList) =>
    post({
      contentType: 'application/json',
      data: txTimestampList,
      endPoint: `/price/index-series?base=${coin}&quote=${currency}`,
      removeDefaultPostData: true,
      url: apiUrl
    })

  const getRandomBytes = (bytes, format) =>
    get({
      data: { bytes, format },
      endPoint: '/v2/randombytes',
      url: apiUrl
    })

  const triggerWalletMagicLink = (email, captchaToken, sessionToken) => {
    post({
      contentType: 'application/json',
      data: {
        captcha: captchaToken,
        email,
        product: 'wallet',
        siteKey: window.CAPTCHA_KEY
      },
      endPoint: '/auth/email-reminder',
      sessionToken,
      url: apiUrl
    })
  }
  return {
    getPriceIndex,
    getPriceIndexSeries,
    getPriceTimestampSeries,
    getRandomBytes,
    triggerWalletMagicLink
  }
}
