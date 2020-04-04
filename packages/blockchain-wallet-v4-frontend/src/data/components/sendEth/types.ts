import { Erc20CoinType } from 'core/types'
import {
  EthAccountFromType,
  EthCustodialFromType
} from 'core/redux/payment/eth/types'

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
  payload: EthAccountFromType | EthCustodialFromType
}
export type SendEthFormToActionType = ISendEthFormChangeActionType & {
  meta: {
    field: 'to'
  }
  payload: { value: { value: EthAccountFromType | EthCustodialFromType } }
}

export type SendEthFormActionType =
  | SendEthFormAmountActionType
  | SendEthFormDescActionType
  | SendEthFormFeeActionType
  | SendEthFormFromActionType
  | SendEthFormToActionType
