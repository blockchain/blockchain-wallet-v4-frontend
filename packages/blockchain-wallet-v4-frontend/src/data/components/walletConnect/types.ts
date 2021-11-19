import { RemoteDataType } from '@core/types'

export enum RequestMethodType {
  ETH_PERSONAL_SIGN = 'personal_sign',
  ETH_SEND_TX = 'eth_sendTransaction',
  ETH_SIGN_TYPED_DATA = 'eth_signTypedData'
}

export type RequestMessagePayload = {
  data?: RequestEthSendTxType | any // TODO
  error?: any
}

export type RequestEthSendTxType = {
  id: number
  jsonrpc: string
  method: RequestMethodType.ETH_SEND_TX
  params: Array<{
    data: string
    from: string
    gas: string
    gasPrice: string
    nonce: string
    to: string
    value: string
  }>
}

export type SessionDetailsType = {
  chainId?: number
  peerId: string
  peerMeta: {
    description?: string
    icons: Array<string>
    name: string
    url: string
  }
}

export type RespondToSessionRequestPayload = {
  action: 'APPROVE' | 'REJECT'
  sessionDetails: SessionDetailsType
  uri: string
}

export type RespondToTxSendRequestPayload = {
  action: 'APPROVE' | 'REJECT'
  requestDetails: RequestEthSendTxType
}

export enum WalletConnectStep {
  APPROVE_TRANSACTION = 'APPROVE_TRANSACTION',
  AUTHORIZE_CONNECTION = 'AUTHORIZE_CONNECTION',
  DISCONNECTION_NOTICE = 'DISCONNECTION_NOTICE',
  LOADING = 'LOADING',
  SESSION_DASHBOARD = 'SESSION_DASHBOARD',
  TRANSACTION_SENT = 'TRANSACTION_SENT'
}

export type WalletConnectStepPayload = {
  data?: RequestEthSendTxType | SessionDetailsType
  error?: any // TODO
  name: keyof typeof WalletConnectStep
}

export type WalletConnectState = {
  sessionDetails?: SessionDetailsType
  step: RemoteDataType<string, WalletConnectStepPayload>
  uri: string
}

export type ModifyDappConnectionPayload = {
  sessionDetails: SessionDetailsType
  uri: string
}
