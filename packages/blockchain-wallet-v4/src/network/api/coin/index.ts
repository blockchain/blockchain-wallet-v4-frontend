import {
  BalanceResponseType,
  IndexMultiResponseType,
  TickerResponseType,
  TxHistoryResponseType
} from './types'

export default ({ apiUrl, get, post }) => {
  const balance = (
    pubKeys: { descriptor: 'default' | 'legacy'; pubKey: string; style: 'SINGLE' }[]
  ): BalanceResponseType => {
    return post({
      contentType: 'application/json',
      data: {
        pubKeys
      },
      // TODO: SELF_CUSTODY
      endPoint: `/currency/stx/balance`,
      removeDefaultPostData: true,
      url: apiUrl
    })
  }

  const txHistory = (
    pubKeys: { descriptor: 'default' | 'legacy'; pubKey: string; style: 'SINGLE' }[]
  ): TxHistoryResponseType => {
    return post({
      contentType: 'application/json',
      data: {
        pubKeys
      },
      // TODO: SELF_CUSTODY
      endPoint: `/currency/stx/txHistory`,
      removeDefaultPostData: true,
      url: apiUrl
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
    balance,
    getBtcTicker,
    getCoinPrices,
    txHistory
  }
}
