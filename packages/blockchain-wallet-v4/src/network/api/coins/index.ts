import {
  ActivityRequestAuthenticationInRequestType,
  ActivityResponseType,
  BuildTxIntentType,
  BuildTxResponseType,
  DeriveAddressResponseType,
  IndexMultiResponseType,
  PubkeyServiceAuthenticationInRequestType,
  PubkeyServiceAuthenticationRequestType,
  PubkeyServiceSubscriptions,
  SubscribeRequestType,
  TickerResponseType,
  TxHistoryAuthInRequestType,
  TxHistoryResponseType,
  UnifiedBalancesResponseType
} from './types'

const getUrlPath = (coin) => {
  if (coin.includes('MATIC')) {
    return 'evm'
  }
  if (coin === 'STX') {
    return 'stx'
  }
}

export default ({ apiUrl, get, post }) => {
  const deriveAddress = (currency: string, pubKey: string): DeriveAddressResponseType => {
    return post({
      contentType: 'application/json',
      data: {
        pubKey
      },
      endPoint: `/currency/${getUrlPath(currency)}/deriveAddress`,
      url: apiUrl
    })
  }

  const validateAddress = (currency: string, address: string): { success: boolean } => {
    return post({
      contentType: 'application/json',
      data: {
        address
      },
      endPoint: `/currency/${getUrlPath(currency)}/validateAddress`,
      url: apiUrl
    })
  }

  const buildTx = (
    currency: string,
    data: {
      id: { guid: string; uuid: string }
      intent: BuildTxIntentType
      network: string
    }
  ): BuildTxResponseType => {
    data.intent.maxVerificationVersion = 1

    return post({
      contentType: 'application/json',
      data,
      endPoint: `/currency/${getUrlPath(currency)}/buildTx`,
      removeDefaultPostData: true,
      url: apiUrl
    })
  }

  const pushTx = (
    currency: string,
    rawTx: BuildTxResponseType['rawTx'],
    signatures: BuildTxResponseType['preImages'],
    id: { guid: string; uuid: string },
    network: string
  ): { txId: string } => {
    return post({
      contentType: 'application/json',
      data: {
        currency,
        id,
        network,
        rawTx,
        signatures
      },
      endPoint: `/currency/${getUrlPath(currency)}/pushTx`,
      removeDefaultPostData: true,
      url: apiUrl
    })
  }

  const authWalletPubkeyService = ({
    guid,
    sharedKeyHash
  }: PubkeyServiceAuthenticationRequestType) =>
    post({
      contentType: 'application/json',
      data: {
        guid,
        sharedKeyHash
      },
      endPoint: '/wallet-pubkey/auth',
      removeDefaultPostData: true,
      url: apiUrl
    })

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

  const subscribe = (data: SubscribeRequestType): { success: boolean } =>
    post({
      contentType: 'application/json',
      data,
      endPoint: '/wallet-pubkey/subscribe',
      removeDefaultPostData: true,
      url: apiUrl
    })

  const getSubscriptions = ({
    guidHash,
    sharedKeyHash
  }: PubkeyServiceAuthenticationInRequestType): PubkeyServiceSubscriptions =>
    post({
      contentType: 'application/json',
      data: {
        auth: {
          guidHash,
          sharedKeyHash
        }
      },
      endPoint: '/wallet-pubkey/subscriptions',
      removeDefaultPostData: true,
      url: apiUrl
    })

  const getCoinTxHistory = ({
    currency,
    guidHash,
    sharedKeyHash
  }: TxHistoryAuthInRequestType): TxHistoryResponseType => {
    return post({
      contentType: 'application/json',
      data: {
        auth: {
          guidHash,
          sharedKeyHash
        },
        currency
      },
      endPoint: `/wallet-pubkey/tx-history`,
      removeDefaultPostData: true,
      url: apiUrl
    })
  }

  const getCoinActivity = ({
    currencies,
    fiatCurrency,
    guidHash,
    sharedKeyHash
  }: ActivityRequestAuthenticationInRequestType): ActivityResponseType => {
    return post({
      contentType: 'application/json',
      data: {
        auth: {
          guidHash,
          sharedKeyHash
        },
        currencies,
        fiatCurrency
      },
      endPoint: `/wallet-pubkey/activity`,
      removeDefaultPostData: true,
      url: apiUrl
    })
  }

  const getUnifiedActivity = ({
    fiatCurrency,
    guidHash,
    sharedKeyHash
  }: PubkeyServiceAuthenticationInRequestType & { fiatCurrency: string }) => {
    post({
      contentType: 'application/json',
      data: {
        auth: {
          guidHash,
          sharedKeyHash
        },
        fiatCurrency
      },
      endPoint: '/wallet-pubkey/activity',
      removeDefaultPostData: true,
      url: apiUrl
    })
  }

  const fetchUnifiedBalances = ({
    fiatCurrency,
    guidHash,
    sharedKeyHash
  }: PubkeyServiceAuthenticationInRequestType & {
    fiatCurrency: string
  }): UnifiedBalancesResponseType =>
    post({
      contentType: 'application/json',
      data: {
        auth: {
          guidHash,
          sharedKeyHash
        },
        fiatCurrency
      },
      endPoint: '/wallet-pubkey/balance',
      removeDefaultPostData: true,
      url: apiUrl
    })

  const unsubscribe = ({
    currency,
    guidHash,
    sharedKeyHash
  }: PubkeyServiceAuthenticationInRequestType & { currency: string }) => {
    post({
      contentType: 'application/json',
      data: {
        auth: { guidHash, sharedKeyHash },
        currency
      },
      endPoint: '/wallet-pubkey/unsubscribe',
      removeDefaultPostData: true,
      url: apiUrl
    })
  }

  return {
    authWalletPubkeyService,
    buildTx,
    deriveAddress,
    fetchUnifiedBalances,
    getBtcTicker,
    getCoinActivity,
    getCoinPrices,
    getCoinTxHistory,
    getSubscriptions,
    getUnifiedActivity,
    pushTx,
    subscribe,
    unsubscribe,
    validateAddress
  }
}
