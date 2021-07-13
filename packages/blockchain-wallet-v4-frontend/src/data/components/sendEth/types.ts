import { EthAccountFromType } from 'blockchain-wallet-v4/src/redux/payment/eth/types'
import {
  CustodialFromType,
  Erc20CoinType,
  EthPaymentType,
  RemoteDataType
} from 'blockchain-wallet-v4/src/types'

export type SendEthState = {
  feeToggled: boolean
  isContract: RemoteDataType<string, boolean>
  payment: RemoteDataType<string, ReturnType<EthPaymentType['value']>>
  step: 1 | 2
}

export type ISendEthFormChangeActionType = {
  meta: {
    form: '@SEND.ETH.FORM'
    persistentSubmitErrors: boolean
    touch: boolean
  }
  type: '@@redux-form/CHANGE'
}

export type SendEthFormAmountActionType = ISendEthFormChangeActionType & {
  meta: {
    field: 'amount'
  }
  payload: {
    coin: string
    coinCode: 'ETH' | Erc20CoinType
    fiat: string
  }
}
export type SendEthFormDescActionType = ISendEthFormChangeActionType & {
  meta: {
    field: 'description'
  }
  payload: string
}
export type SendEthFormFeeActionType = ISendEthFormChangeActionType & {
  meta: {
    field: 'fee'
  }
  payload: number
}
export type SendEthFormFromActionType = ISendEthFormChangeActionType & {
  meta: {
    field: 'from'
  }
  payload: EthAccountFromType | CustodialFromType
}
export type SendEthFormToActionType = ISendEthFormChangeActionType & {
  meta: {
    field: 'to'
  }
  payload: { value: { value: EthAccountFromType | CustodialFromType } }
}

export type SendEthFormActionType =
  | SendEthFormAmountActionType
  | SendEthFormDescActionType
  | SendEthFormFeeActionType
  | SendEthFormFromActionType
  | SendEthFormToActionType
