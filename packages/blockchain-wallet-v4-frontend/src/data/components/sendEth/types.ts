import { EthAccountFromType, EthFromType } from '@core/redux/payment/eth/types'
import {
  CoinType,
  CrossBorderLimits,
  CustodialFromType,
  Erc20CoinType,
  EthPaymentType,
  RemoteDataType
} from '@core/types'

export type SendEthState = {
  feeToggled: boolean
  isContract: RemoteDataType<string, boolean>
  maxCustodialWithdrawalFee: RemoteDataType<string, string>
  payment: RemoteDataType<string, ReturnType<EthPaymentType['value']>>
  sendLimits: RemoteDataType<string, CrossBorderLimits>
  step: 1 | 2
}

export type SendEthFormValue =
  | {
      amount?: {
        coin?: string
        coinCode?: string
        fiat?: string
      }
      coin?: CoinType
      description?: string
      feePerByte?: number
      from?: EthFromType
      payPro?: string
      to?: null | EthFromType
    }
  | undefined

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
