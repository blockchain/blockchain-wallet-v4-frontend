import { CrossBorderLimits, PaymentValue, RemoteDataType } from '@core/types'

// State
export type SendBtcState = {
  feePerByteToggled: boolean
  payment: RemoteDataType<string, PaymentValue>
  sendLimits: RemoteDataType<string, CrossBorderLimits>
  step: 1 | 2
}
