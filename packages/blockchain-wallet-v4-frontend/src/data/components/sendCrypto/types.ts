import {
  RemoteDataType,
  WithdrawalLockResponseType,
  WithdrawalMinsAndFeesResponse
} from 'core/types'

// state
export type SendCryptoState = {
  step: SendCryptoStepType
  withdrawLocks: RemoteDataType<string, WithdrawalLockResponseType>
  withdrawalFeesAndMins: RemoteDataType<string, WithdrawalMinsAndFeesResponse>
}

export type SendCryptoStepPayload = {
  step: SendCryptoStepType
}

export enum SendCryptoStepType {
  'COIN_SELECTION',
  'ENTER_TO',
  'ENTER_AMOUNT',
  'CONFIRM',
  'RESULT',
  'DETAILS'
}
