import { PaymentValue, RemoteDataType } from '@core/types'

import { SeamlessLimits } from '../withdraw/types'

// State
export type SendBtcState = {
  feePerByteToggled: boolean
  payment: RemoteDataType<string, PaymentValue>
  sendLimits: RemoteDataType<string, SeamlessLimits>
  step: 1 | 2
}
