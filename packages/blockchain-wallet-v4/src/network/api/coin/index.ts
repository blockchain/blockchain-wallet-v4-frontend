import {
  BalanceResponseType,
  BuildTxIntentType,
  BuildTxResponseType,
  IndexMultiResponseType,
  TickerResponseType
} from './types'

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
    intent: BuildTxIntentType
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
  const pushTx = (
    currency: string,
    rawTx: BuildTxResponseType['rawTx'],
    signatures: BuildTxResponseType['preImages'],
    id: { guid: string; uuid: string }
  ): { txId: string } => {
    return post({
      contentType: 'application/json',
      data: {
        currency,
        id,
        rawTx,
        signatures
      },
      endPoint: `/public/pushTx`,
      removeDefaultPostData: true,
      url: 'http://localhost:4444'
    })
  }

  // TODO: SELF_CUSTODY
  const balance = (
    pubKeys: { descriptor: 'default'; pubKey: string; style: 'SINGLE' }[]
  ): BalanceResponseType => {
    return post({
      contentType: 'application/json',
      data: {
        pubKeys
      },
      endPoint: `/public/balance`,
      removeDefaultPostData: true,
      url: 'http://localhost:4444'
    })
  }

  const txHistory = (pubKeys: { descriptor: 'default'; pubKey: string; style: 'SINGLE' }[]) => {
    return post({
      contentType: 'application/json',
      data: {
        pubKeys
      },
      endPoint: `/public/txHistory`,
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
    balance,
    buildTx,
    deriveAddress,
    getBtcTicker,
    getCoinPrices,
    pushTx,
    txHistory,
    validateAddress
  }
}
