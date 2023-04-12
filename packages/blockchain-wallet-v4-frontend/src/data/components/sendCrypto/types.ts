import { BuildTxResponseType } from '@core/network/api/coin/types'
import {
  CoinType,
  CrossBorderLimits,
  RemoteDataType,
  WithdrawalLockResponseType,
  WithdrawalMinsAndFeesResponse,
  WithdrawAmount
} from '@core/types'
import { SwapAccountType } from 'data/types'

// state
export type SendCryptoState = {
  custodialWithdrawalFee: RemoteDataType<string, string>
  initialCoin?: string
  isValidAddress: RemoteDataType<string, boolean>
  maxCustodialWithdrawalFee: RemoteDataType<string, string>
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
  withdrawalMin: RemoteDataType<string, string>
}
export type GetMaxWithdrawalFeeType = {
  coin: CoinType
}

export type SendCryptoFormType =
  | {
      amount?: string
      coin?: CoinType
      fee?: string
      fix?: string
      selectedAccount?: {
        balance: string
        baseCoin: CoinType
        coin: CoinType
        label: string
        type: 'CUSTODIAL'
      }
    }
  | undefined

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
  'STATUS'
}
