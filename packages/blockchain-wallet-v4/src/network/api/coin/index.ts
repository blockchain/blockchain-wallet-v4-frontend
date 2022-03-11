import { IndexMultiResponseType, TickerResponseType } from './types'

export default ({ apiUrl, get, post }) => {
  // TODO: SELF_CUSTODY
  const getCoinAddress = (coin: string, pubKey: string) => {
    return post({
      contentType: 'application/json',
      data: {
        pubKey
      },
      endPoint: `/deriveAddress`,
      url: 'http://localhost:4444'
    })
  }

  // TODO: SELF_CUSTODY
  const validateAddress = (coin: string, address: string): { success: boolean } => {
    return post({
      contentType: 'application/json',
      data: {
        address
      },
      endPoint: `/validateAddress`,
      url: 'http://localhost:4444'
    })
  }

  const getCoinPrices = (
    coins: { base: string; quote: string }[],
    timestamp?: number
  ): IndexMultiResponseType =>
    post({
      contentType: 'application/json',
      data: coins,
      endPoint: timestamp ? `/price/index-multi?time=${timestamp}` : '/price/index-multi',
      removeDefaultPostData: true,
      url: apiUrl
    })

  // 🔥
  // BTC price ticker is used to triangulate FIAT prices
  const getBtcTicker = (): TickerResponseType =>
    get({
      data: { base: 'BTC' },
      endPoint: '/ticker',
      url: apiUrl
    })

  return {
    getBtcTicker,
    getCoinAddress,
    getCoinPrices,
    validateAddress
  }
}
