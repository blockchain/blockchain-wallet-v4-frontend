import { BuildTxResponseType } from '@core/network/api/coin/types'
import {
  CrossBorderLimits,
  PaymentValue,
  RemoteDataType,
  WithdrawalLockResponseType,
  WithdrawalMinsAndFeesResponse,
  WithdrawAmount
} from '@core/types'
import { SwapAccountType } from 'data/types'

// state
export type SendCryptoState = {
  initialCoin?: string
  isValidAddress: RemoteDataType<string, boolean>
  payment?: RemoteDataType<string, PaymentValue>
  prebuildTx: RemoteDataType<string, SharedBuildTxResponseType>
  sendLimits: RemoteDataType<string, CrossBorderLimits>
  step: SendCryptoStepType
  transaction: RemoteDataType<
    string,
    {
      amount: WithdrawAmount
    }
  >
  withdrawLocks: RemoteDataType<string, WithdrawalLockResponseType>
  withdrawalFeesAndMins: RemoteDataType<string, WithdrawalMinsAndFeesResponse>
}

export type SharedBuildTxResponseType = {
  preImages?: BuildTxResponseType['preImages']
  rawTx?: BuildTxResponseType['rawTx']
  summary: BuildTxResponseType['summary']
}

export type SendCryptoStepPayload = {
  step: SendCryptoStepType
}

export type FetchSendLimitsPayload = {
  account: SwapAccountType
}

export enum SendCryptoStepType {
  'NO_FUNDS',
  'COIN_SELECTION',
  'ENTER_TO',
  'ENTER_AMOUNT',
  'CONFIRM',
  'STATUS',
  'TX_OVERVIEW'
}
