import {
  RemoteDataType,
  WithdrawalLockResponseType,
  WithdrawalMinsAndFeesResponse,
  WithdrawResponseType
} from '@core/types'
import { SeamlessLimits, SwapAccountType } from 'data/types'

// state
export type SendCryptoState = {
  initialCoin?: string
  sendLimits: RemoteDataType<string, SeamlessLimits>
  step: SendCryptoStepType
  transaction: RemoteDataType<string, WithdrawResponseType>
  withdrawLocks: RemoteDataType<string, WithdrawalLockResponseType>
  withdrawalFeesAndMins: RemoteDataType<string, WithdrawalMinsAndFeesResponse>
}

export type SendCryptoStepPayload = {
  step: SendCryptoStepType
}

export type FetchSendLimitsPayload = {
  account: SwapAccountType
}

export enum SendCryptoStepType {
  'COIN_SELECTION',
  'ENTER_TO',
  'ENTER_AMOUNT',
  'CONFIRM',
  'STATUS'
}
