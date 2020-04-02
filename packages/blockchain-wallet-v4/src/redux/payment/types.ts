import { CoinType } from 'core/types'
import { UTXOType } from './btc/types'

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
  to?: Array<any>
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
  isSufficientEthForErc20: boolean
}

type XlmPaymentValue = IPaymentValue & {
  amount?: string
  coin: 'XLM'
}

type IPaymentType = {
  build: () => PaymentType
  publish: () => PaymentType
  sign: (pw: string) => PaymentType
  to: (address: string, addressType?: FromType) => PaymentType
}

export type BchPaymentType = IPaymentType & {
  amount: (n: number) => BchPaymentType
  coin: 'BCH'
  value: () => BtcPaymentValue
}

export type BtcPaymentType = IPaymentType & {
  amount: (n: number) => BtcPaymentType
  coin: 'BTC'
  value: () => BtcPaymentValue
}

export type EthPaymentType = IPaymentType & {
  amount: (n: string) => EthPaymentType
  coin: 'ETH' | 'PAX'
  value: () => EthPaymentValue
}

export type XlmPaymentType = IPaymentType & {
  amount: (n: string) => XlmPaymentType
  coin: 'XLM'
  value: () => XlmPaymentValue
}

export type PaymentType =
  | BchPaymentType
  | BtcPaymentType
  | EthPaymentType
  | XlmPaymentType

export type PaymentValue = BtcPaymentValue | EthPaymentValue | XlmPaymentValue

export * from './btc/types'
