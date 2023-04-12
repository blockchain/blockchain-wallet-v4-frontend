import { BtcFromType, CoinType, CrossBorderLimits, PaymentValue, RemoteDataType } from '@core/types'

// State
export type SendBtcState = {
  feePerByteToggled: boolean
  maxCustodialWithdrawalFee: RemoteDataType<string, string>
  payment: RemoteDataType<string, PaymentValue>
  sendLimits: RemoteDataType<string, CrossBorderLimits>
  step: 1 | 2
}

export type SendBtcFormValues =
  | {
      amount?: {
        coin?: string
        coinCode?: string
        fiat?: string
      }
      coin?: CoinType
      description?: string
      feePerByte?: number
      from?: BtcFromType
      payPro?: string
      to?: null | BtcFromType
    }
  | undefined
