import { getUnixTime } from 'date-fns'

import { CoinfigType, CoinType, FiatType } from '@core/types'

import { PriceIndexResponseType } from './types'

export default ({ apiUrl, get, post }) => {
  const getAssets = (): { currencies: CoinfigType[] } =>
    get({
      endPoint: '/assets/currencies/custodial',
      url: apiUrl
    })

  const getErc20Assets = (): { currencies: CoinfigType[] } =>
    get({
      endPoint: '/assets/currencies/erc20',
      url: apiUrl
    })

  const getPriceIndex = (
    base: CoinType,
    quote: FiatType,
    time: number | string
  ): PriceIndexResponseType =>
    get({
      data: { base, quote, time: getUnixTime(new Date(time)) },
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

  const triggerWalletMagicLink = (sessionToken, email, captchaToken, product, redirect) =>
    post({
      contentType: 'application/json',
      data: {
        captcha: captchaToken,
        email,
        product,
        redirect_url: redirect,
        siteKey: window.CAPTCHA_KEY
      },
      endPoint: '/auth/email-reminder',
      sessionToken,
      url: apiUrl
    })

  return {
    getAssets,
    getErc20Assets,
    getPriceIndex,
    getPriceIndexSeries,
    getPriceTimestampSeries,
    getRandomBytes,
    triggerWalletMagicLink
  }
}
