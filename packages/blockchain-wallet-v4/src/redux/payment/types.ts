import { CoinType } from 'core/types'

export type UTXOType = {
  address: string
  change: boolean
  index: number
  path: string
  script: string
  txHash: string
  value: number
  xpub: {
    m: string
    path: string
  }
}

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
  fee: number
  fromAccountIdx: number
  selection?: {
    fee: number
    inputs: Array<UTXOType>
    outputs: Array<UTXOType>
  }
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
  value: () => PaymentValue
}

type BchPaymentType = IPaymentType & {
  amount: (n: number) => BchPaymentType
  coin: 'BCH'
}

type BtcPaymentType = IPaymentType & {
  amount: (n: number) => BtcPaymentType
  coin: 'BTC'
}

type EthPaymentType = IPaymentType & {
  amount: (n: string) => EthPaymentType
  coin: 'ETH' | 'PAX'
}

type XlmPaymentType = IPaymentType & {
  amount: (n: string) => XlmPaymentType
  coin: 'XLM'
}

export type PaymentType =
  | BchPaymentType
  | BtcPaymentType
  | EthPaymentType
  | XlmPaymentType

export type PaymentValue = BtcPaymentValue | EthPaymentValue | XlmPaymentValue
