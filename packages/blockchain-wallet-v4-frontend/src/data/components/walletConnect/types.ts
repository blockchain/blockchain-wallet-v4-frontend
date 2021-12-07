import { IWalletConnectSession } from '@walletconnect/types'

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

export type RespondToSessionRequestPayload = {
  action: 'APPROVE' | 'REJECT'
  sessionDetails: IWalletConnectSession
  uri: string
}

export type RespondToTxSendRequestPayload = {
  action: 'APPROVE' | 'REJECT'
  requestDetails: RequestEthSendTxType
}

export enum WalletConnectStep {
  ADD_NEW_CONNECTION = 'ADD_NEW_CONNECTION',
  APPROVE_TRANSACTION = 'APPROVE_TRANSACTION',
  AUTHORIZE_CONNECTION = 'AUTHORIZE_CONNECTION',
  DISCONNECTION_NOTICE = 'DISCONNECTION_NOTICE',
  LOADING = 'LOADING',
  SESSION_DASHBOARD = 'SESSION_DASHBOARD',
  TRANSACTION_SENT = 'TRANSACTION_SENT'
}

export type WalletConnectStepPayload = {
  data?: RequestEthSendTxType | IWalletConnectSession
  error?: any // TODO
  name: keyof typeof WalletConnectStep
}

export type WalletConnectState = {
  sessionDetails?: IWalletConnectSession
  step: RemoteDataType<string, WalletConnectStepPayload>
  uri: string
}

export type AddNewDappFormType = {
  newConnectionString: string
}

export type InitWalletConnectPayload = {
  sessionDetails?: IWalletConnectSession
  uri: string
}

export type ReuseWalletConnectPayload = {
  sessionDetails: IWalletConnectSession
  uri: string
}
