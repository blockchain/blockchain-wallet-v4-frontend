import { CoinType } from 'core/types'
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
  from: Array<string>
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
  coin: 'ETH' | 'PAX'
  description?: string
  from: {
    address: string
    type: FromType
  }
  isSufficientEthForErc20: boolean
  to?: EthAccountFromType | EthAddressFromType
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
  to: (addressOrIndex: string | number, addressType?: FromType) => PaymentType
}

export type BchPaymentType = IPaymentType & {
  amount: (n: number) => BchPaymentType
  coin: 'BCH'
  description: (arg: string) => BtcPaymentType
  fee: (arg: number) => BtcPaymentType
  value: () => BtcPaymentValue
}

export type BtcPaymentType = IPaymentType & {
  amount: (n: number) => BtcPaymentType
  coin: 'BTC'
  description: (arg: string) => BtcPaymentType
  fee: (arg: number) => BtcPaymentType
  value: () => BtcPaymentValue
}

export type EthPaymentType = IPaymentType & {
  amount: (n: string) => EthPaymentType
  coin: 'ETH' | 'PAX'
  description: (arg: string) => EthPaymentType
  fee: (arg: number, account: string) => EthPaymentType
  value: () => EthPaymentValue
}

export type XlmPaymentType = IPaymentType & {
  amount: (n: string) => XlmPaymentType
  coin: 'XLM'
  description: (arg: string) => XlmPaymentType
  memo: (arg: string) => XlmPaymentType
  memoType: (arg: string) => XlmPaymentType
  value: () => XlmPaymentValue
}

export type PaymentType =
  | BchPaymentType
  | BtcPaymentType
  | EthPaymentType
  | XlmPaymentType

export type PaymentValue = BtcPaymentValue | EthPaymentValue | XlmPaymentValue

export * from './btc/types'
