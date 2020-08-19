import { CoinType, Erc20CoinType } from 'core/types'
import { EthAccountFromType, EthAddressFromType } from './eth/types'
import { UTXOType } from './btc/types'
import { XlmAccountFromType, XlmAddressFromType } from './xlm/types'

export type FromType =
  | 'ACCOUNT'
  | 'LEGACY'
  | 'WATCH_ONLY'
  | 'EXTERNAL'
  | 'LOCKBOX'
  | 'ADDRESS'
  | 'CUSTODIAL'

type IPaymentValue = {
  change: string
  coin: CoinType
  effectiveBalance: number
  fees: {
    limits: {
      max: number
      min: number
    }
    priority: number
    regular: number
  }
  from?: Array<string>
  fromType: FromType
  to?: Array<{
    accountIndex?: number
    address: string
    addressIndex?: number
    type: FromType
  }>
}

type BtcPaymentValue = IPaymentValue & {
  amount?: Array<number>
  coin: 'BTC' | 'BCH'
  coins: Array<UTXOType>
  description?: string
  fee: number
  fromAccountIdx: number
  selection?: {
    fee: number
    inputs: Array<UTXOType>
    outputs: Array<UTXOType>
  }
  txId?: string
}

type EthPaymentValue = IPaymentValue & {
  amount?: string
  coin: 'ETH' | 'PAX' | 'USDT'
  description?: string
  from: {
    address: string
    type: FromType
  }
  isRetryAttempt: boolean | undefined
  isSufficientEthForErc20: boolean
  minFee?: string
  to?: EthAccountFromType | EthAddressFromType
  txId?: string
}

type AlgoPaymentValue = IPaymentValue & {
  amount?: string
  coin: 'ALGO'
  description?: string
  to?: string
  txId?: string
}

type XlmPaymentValue = IPaymentValue & {
  amount?: string
  coin: 'XLM'
  description?: string
  to?: XlmAccountFromType | XlmAddressFromType
  txId?: string
}

type IPaymentType = {
  build: () => PaymentType
  from: (
    addressOrIndex?: string | number,
    addressType?: FromType,
    effectiveBalance?: string
  ) => PaymentType
  publish: () => PaymentType
  sign: (pw: string) => PaymentType
}

export type BchPaymentType = IPaymentType & {
  amount: (n: number) => BchPaymentType
  chain: () => BchPaymentType
  coin: 'BCH'
  description: (arg: string) => BchPaymentType
  done: () => BchPaymentType
  fee: (arg: number) => BchPaymentType
  init: () => BchPaymentType
  to: (
    addressOrIndex: string | number,
    addressType?: FromType
  ) => BchPaymentType
  value: () => BtcPaymentValue
}

export type BtcPaymentType = IPaymentType & {
  amount: (n: number) => BtcPaymentType
  chain: () => BtcPaymentType
  coin: 'BTC'
  description: (arg: string) => BtcPaymentType
  done: () => BtcPaymentType
  fee: (arg: number) => BtcPaymentType
  init: () => BtcPaymentType
  to: (
    addressOrIndex: string | number,
    addressType?: FromType
  ) => BtcPaymentType
  value: () => BtcPaymentValue
}

export type EthPaymentType = IPaymentType & {
  amount: (n: string) => EthPaymentType
  chain: () => EthPaymentType
  coin: 'ETH' | 'PAX' | 'USDT'
  description: (arg: string) => EthPaymentType
  done: () => EthPaymentType
  fee: (arg: number, account: string) => EthPaymentType
  init: (arg: {
    coin: 'ETH' | Erc20CoinType
    isErc20?: boolean
  }) => EthPaymentType
  setIsRetryAttempt: (
    isRetryAttempt: boolean,
    nonce: string,
    minFeeRequiredForRetry: string
  ) => EthPaymentType
  signLegacy: (password: string) => EthPaymentType
  to: (
    addressOrIndex: string | number,
    addressType?: FromType
  ) => EthPaymentType
  value: () => EthPaymentValue
}

export type XlmPaymentType = IPaymentType & {
  amount: (n: string) => XlmPaymentType
  chain: () => XlmPaymentType
  coin: 'XLM'
  description: (arg: string) => XlmPaymentType
  done: () => XlmPaymentType
  init: () => XlmPaymentType
  memo: (arg: string) => XlmPaymentType
  memoType: (arg: string) => XlmPaymentType
  to: (
    addressOrIndex: string | number,
    addressType?: FromType
  ) => XlmPaymentType
  value: () => XlmPaymentValue
}

export type PaymentType =
  | BchPaymentType
  | BtcPaymentType
  | EthPaymentType
  | XlmPaymentType

export type PaymentValue =
  | BtcPaymentValue
  | EthPaymentValue
  | XlmPaymentValue
  | AlgoPaymentValue

export * from './btc/types'
