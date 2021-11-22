import {
  FiatBSAndSwapTransactionType,
  ProcessedTxType,
  BSOrderType,
  BSTransactionType
} from '@core/types'

export type TransferType = 'sent' | 'received' | 'transferred' | ''
export type TxType =
  | BSTransactionType
  | BSOrderType
  | ProcessedTxType
  | FiatBSAndSwapTransactionType
