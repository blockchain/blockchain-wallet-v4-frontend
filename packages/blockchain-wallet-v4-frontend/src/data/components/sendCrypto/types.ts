import {
  RemoteDataType,
  WithdrawalLockResponseType,
  WithdrawalMinsAndFeesResponse,
  WithdrawResponseType
} from 'core/types'

// state
export type SendCryptoState = {
  initialCoin?: string
  step: SendCryptoStepType
  transaction: RemoteDataType<string, WithdrawResponseType>
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
  'STATUS'
}
