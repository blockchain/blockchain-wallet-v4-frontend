import { IndexMultiResponseType, TickerResponseType } from './types'

export default ({ apiUrl, get, post }) => {
  // TODO: SELF_CUSTODY
  const deriveAddress = (coin: string, pubKey: string) => {
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

  // TODO: SELF_CUSTODY
  // {
  //   "intent": {
  //     "coin": "string",
  //     "type": "PAYMENT",
  //     "source": {
  //       "pubkey": "string",
  //       "guid": "string"
  //     },
  //     "destination": "string",
  //     "amount": "string",
  //     "fee": "string",
  //     "additional_data": {
  //       "memo": "string",
  //       "txID": "string"
  //     },
  //     "maxVerificationVersion": "string"
  //   },
  //   "id": {
  //     "uuid": "string",
  //     "guid": "string"
  //   }
  // }
  const buildTx = (data: {
    additional_data?: { memo: string; txID: string }
    amount: string
    coin: string
    destination: string
    fee: string
    source: { guid: string; pubkey: string }
    type: 'PAYMENT'
  }) => {
    return post({
      contentType: 'application/json',
      data: {
        data
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
    buildTx,
    deriveAddress,
    getBtcTicker,
    getCoinPrices,
    validateAddress
  }
}
