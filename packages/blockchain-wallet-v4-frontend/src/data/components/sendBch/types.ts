import { PaymentValue, RemoteDataType } from 'core/types'

// State
export type SendBchState = {
  payment: RemoteDataType<string, PaymentValue>
  step: 1 | 2
}
