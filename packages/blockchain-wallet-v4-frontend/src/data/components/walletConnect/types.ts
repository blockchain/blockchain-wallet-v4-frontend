import { RemoteDataType, RemoteLoading } from '@core/types'

/*
{
    "data": {
        "id": 1627835604790579,
        "jsonrpc": "2.0",
        "method": "eth_sendTransaction",
        "params": [
            {
                "from": "0x825Fe1426590C4ef8F67975fA477494A96D59824",
                "to": "0x825Fe1426590C4ef8F67975fA477494A96D59824",
                "gasPrice": "0x7ea8ed400",
                "gas": "0x5208",
                "value": "0x0",
                "nonce": "0x0",
                "data": "0x"
            }
        ]
    },
    "error": null
}
 */

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
}

export type RespondToTxSendRequestPayload = {
  action: 'APPROVE' | 'REJECT'
  requestDetails: RequestEthSendTxType
}
export enum WalletConnectStep {
  APPROVE_TRANSACTION_STEP = 'APPROVE_TRANSACTION_STEP',
  AUTHORIZE_CONNECTION = 'AUTHORIZE_CONNECTION',
  DISCONNECTION_NOTICE = 'DISCONNECTION_NOTICE',
  SESSION_DASHBOARD = 'SESSION_DASHBOARD',
  TRANSACTION_SENT = 'TRANSACTION_SENT'
}

export type WalletConnectPayload = {
  data?: RequestEthSendTxType | any // TODO
  error?: any // TODO
  name: keyof typeof WalletConnectStep
}

export type WalletConnectStepPayload = WalletConnectPayload | RemoteLoading

export type WalletConnectState = {
  sessionDetails?: SessionDetailsType
  step: RemoteDataType<string, WalletConnectStepPayload>
}
