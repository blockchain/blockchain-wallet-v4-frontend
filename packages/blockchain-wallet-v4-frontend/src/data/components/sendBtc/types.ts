import { PaymentValue, RemoteDataType } from 'blockchain-wallet-v4/src/types'

// State
export type SendBtcState = {
  feePerByteToggled: boolean
  payment: RemoteDataType<string, PaymentValue>
  step: 1 | 2
}
