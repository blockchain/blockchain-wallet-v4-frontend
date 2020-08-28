import { PaymentValue, RemoteDataType } from 'core/types'

// State
export type SendBtcState = {
  feePerByteToggled: boolean
  payment: RemoteDataType<string, PaymentValue>
  step: 1 | 2
}
