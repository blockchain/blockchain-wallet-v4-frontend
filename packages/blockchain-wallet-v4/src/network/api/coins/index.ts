import {
  AuthorizePubkeyParamType,
  BuildTxIntentParamType,
  BuildTxResponseType,
  DeriveAddressParamType,
  DeriveAddressResponseType,
  GenericPubKeyResponse,
  GetAddressesRequestType,
  GetAddressesResponseType,
  GetSubscriptionsRequestType,
  GetSubscriptionsResponseType,
  GetTxHistoryRequestType,
  GetTxHistoryResponseType,
  GetUnifiedBalanceRequestType,
  GetUnifiedBalanceResponseType,
  PushTxParamType,
  PushTxResponseType,
  SubscribeRequestType,
  UnsubscribeRequestType,
  ValidateAddressParamType
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
  const authorizePubkey = (data: AuthorizePubkeyParamType): GenericPubKeyResponse =>
    post({
      contentType: 'application/json',
      data,
      endPoint: `/wallet-pubkey/auth`,
      removeDefaultPostData: true,
      url: apiUrl
    })

  const getAddresses = (data: GetAddressesRequestType): GetAddressesResponseType =>
    post({
      contentType: 'application/json',
      data,
      endPoint: `/wallet-pubkey/addresses`,
      removeDefaultPostData: true,
      url: apiUrl
    })

  const getSubscriptions = (data: GetSubscriptionsRequestType): GetSubscriptionsResponseType =>
    post({
      contentType: 'application/json',
      data,
      endPoint: `/wallet-pubkey/subscriptions`,
      removeDefaultPostData: true,
      url: apiUrl
    })

  const getTxHistory = (data: GetTxHistoryRequestType): GetTxHistoryResponseType =>
    post({
      contentType: 'application/json',
      data,
      endPoint: `/wallet-pubkey/tx-history`,
      removeDefaultPostData: true,
      url: apiUrl
    })

  const getUnifiedBalances = (data: GetUnifiedBalanceRequestType): GetUnifiedBalanceResponseType =>
    post({
      contentType: 'application/json',
      data,
      endPoint: `/wallet-pubkey/balance`,
      removeDefaultPostData: true,
      url: apiUrl
    })

  const buildTx = (data: BuildTxIntentParamType): BuildTxResponseType =>
    post({
      contentType: 'application/json',
      data,
      // TODO: SELF_CUSTODY
      endPoint: `/wallet-pubkey/buildTx`,
      removeDefaultPostData: true,
      url: apiUrl
    })

  const deriveAddress = ({ coin, pubkey }: DeriveAddressParamType): DeriveAddressResponseType =>
    post({
      contentType: 'application/json',
      data: {
        pubkey
      },
      endPoint: `/currency/${getUrlPath(coin)}/deriveAddress`,
      removeDefaultPostData: true,
      url: apiUrl
    })

  const pushTx = (data: PushTxParamType): PushTxResponseType =>
    post({
      contentType: 'application/json',
      data,
      endPoint: `/wallet-pubkey/pushTx`,
      removeDefaultPostData: true,
      url: apiUrl
    })

  const subscribe = (data: SubscribeRequestType): GenericPubKeyResponse =>
    post({
      contentType: 'application/json',
      data,
      endPoint: `/wallet-pubkey/subscribe`,
      removeDefaultPostData: true,
      url: apiUrl
    })

  const unsubscribe = (data: UnsubscribeRequestType): GenericPubKeyResponse =>
    post({
      contentType: 'application/json',
      data,
      endPoint: `/wallet-pubkey/unsubscribe`,
      removeDefaultPostData: true,
      url: apiUrl
    })

  const validateAddress = ({ address, coin }: ValidateAddressParamType): GenericPubKeyResponse => {
    return post({
      contentType: 'application/json',
      data: {
        address
      },
      // TODO: SELF_CUSTODY
      endPoint: `/currency/${getUrlPath(coin)}/validateAddress`,
      removeDefaultPostData: true,
      url: apiUrl
    })
  }

  return {
    authorizePubkey,
    buildTx,
    deriveAddress,
    getAddresses,
    getSubscriptions,
    getTxHistory,
    getUnifiedBalances,
    pushTx,
    subscribe,
    unsubscribe,
    validateAddress
  }
}
