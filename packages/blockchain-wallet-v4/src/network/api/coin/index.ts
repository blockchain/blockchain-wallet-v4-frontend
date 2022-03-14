import { BuildTxResponseType, IndexMultiResponseType, TickerResponseType } from './types'

export default ({ apiUrl, get, post }) => {
  // TODO: SELF_CUSTODY
  const deriveAddress = (coin: string, pubKey: string) => {
    return post({
      contentType: 'application/json',
      data: {
        pubKey
      },
      endPoint: `/public/deriveAddress`,
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
      endPoint: `/public/validateAddress`,
      url: 'http://localhost:4444'
    })
  }

  // TODO: SELF_CUSTODY
  const buildTx = (data: {
    id: { guid: string; uuid: string }
    intent: {
      additional_data?: { memo: string }
      amount: string
      coin: string
      destination: string
      fee: string
      maxVerificationVersion?: number
      source: { pubKey: string }
      type: 'PAYMENT'
    }
  }): BuildTxResponseType => {
    data.intent.maxVerificationVersion = 2

    return post({
      contentType: 'application/json',
      data,
      endPoint: `/public/buildTx`,
      removeDefaultPostData: true,
      url: 'http://localhost:4444'
    })
  }

  // TODO: SELF_CUSTODY
  const pushTx = (data: {
    id: { guid: string; uuid: string }
    intent: {
      additional_data?: { memo: string }
      amount: string
      coin: string
      destination: string
      fee: string
      maxVerificationVersion?: number
      source: { pubKey: string }
      type: 'PAYMENT'
    }
  }): BuildTxResponseType => {
    data.intent.maxVerificationVersion = 2

    return post({
      contentType: 'application/json',
      data,
      endPoint: `/public/pushTx`,
      removeDefaultPostData: true,
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
    buildTx,
    deriveAddress,
    getBtcTicker,
    getCoinPrices,
    pushTx,
    validateAddress
  }
}
