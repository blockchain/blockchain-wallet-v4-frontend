import { BuildTxResponseType } from '@core/network/api/coin/types'
import {
  CrossBorderLimits,
  RemoteDataType,
  WithdrawalLockResponseType,
  WithdrawalMinsAndFeesResponse,
  WithdrawResponseType
} from '@core/types'
import { SwapAccountType } from 'data/types'

// state
export type SendCryptoState = {
  initialCoin?: string
  isValidAddress: RemoteDataType<string, boolean>
  prebuildTx: RemoteDataType<string, BuildTxResponseType>
  sendLimits: RemoteDataType<string, CrossBorderLimits>
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
