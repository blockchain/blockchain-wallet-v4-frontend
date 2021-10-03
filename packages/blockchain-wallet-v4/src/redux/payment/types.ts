import { CoinType } from 'core/types'

import { UTXOType } from './btc/types'
import { ADDRESS_TYPES } from './btc/utils'
import { EthAccountFromType, EthAddressFromType } from './eth/types'
import { XlmAccountFromType, XlmAddressFromType } from './xlm/types'

export type AddressTypesType = keyof typeof ADDRESS_TYPES

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
  fromType: AddressTypesType
  to?: Array<{
    accountIndex?: number
    address: string
    addressIndex?: number
    type: AddressTypesType
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
  coin: 'ETH' | 'PAX' | 'USDT' | 'WDGLD'
  description?: string
  fee?: number
  from: {
    address: string
    type: AddressTypesType
  }
  isRetryAttempt: boolean | undefined
  isSufficientEthForErc20: boolean
  minFee?: string
  to?: EthAccountFromType | EthAddressFromType
  txId?: string
}

type XlmPaymentValue = IPaymentValue & {
  amount?: string
  coin: 'XLM'
  description?: string
  fee?: number
  memo?: string
  to?: XlmAccountFromType | XlmAddressFromType
  txId?: string
}

type IPaymentType = {
  build: () => PaymentType
  chain: () => PaymentType
  done: () => PaymentType
  from: (
    addressOrIndex?: string | number,
    addressType?: AddressTypesType,
    effectiveBalance?: string
  ) => PaymentType
  publish: () => PaymentType
  sign: (pw: string) => PaymentType
  to: (addressOrIndex: string | number, addressType?: AddressTypesType) => PaymentType
}

export type BchPaymentType = IPaymentType & {
  amount: (n: number | string) => BchPaymentType
  coin: 'BCH'
  description: (arg: string) => BtcPaymentType
  fee: (arg: number) => BtcPaymentType
  value: () => BtcPaymentValue
}

export type BtcPaymentType = IPaymentType & {
  amount: (n: number | string) => BtcPaymentType
  coin: 'BTC'
  description: (arg: string) => BtcPaymentType
  fee: (arg: number) => BtcPaymentType
  value: () => BtcPaymentValue
}

export type EthPaymentType = IPaymentType & {
  amount: (n: number | string) => EthPaymentType
  coin: 'ETH' | string
  description: (arg: string) => EthPaymentType
  fee: (arg: number, account: string, coin?: string) => EthPaymentType
  init: (arg: { coin: 'ETH' | string; isErc20?: boolean }) => EthPaymentType
  setIsRetryAttempt: (
    isRetryAttempt: boolean,
    nonce: string,
    minFeeRequiredForRetry: string
  ) => EthPaymentType
  signLegacy: (password: string) => EthPaymentType
  value: () => EthPaymentValue
}

export type XlmPaymentType = IPaymentType & {
  amount: (n: number | string) => XlmPaymentType
  coin: 'XLM'
  description: (arg: string) => XlmPaymentType
  fee: (arg: string) => XlmPaymentType
  memo: (arg: string) => XlmPaymentType
  memoType: (arg: string) => XlmPaymentType
  value: () => XlmPaymentValue
}

export type PaymentType = BchPaymentType | BtcPaymentType | EthPaymentType | XlmPaymentType

export type PaymentValue = BtcPaymentValue | EthPaymentValue | XlmPaymentValue

export * from './btc/types'
