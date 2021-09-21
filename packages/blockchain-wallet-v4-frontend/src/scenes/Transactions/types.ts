import {
  FiatSBAndSwapTransactionType,
  ProcessedTxType,
  SBOrderType,
  SBTransactionType
} from '@core/types'

export type TransferType = 'sent' | 'received' | 'transferred' | ''
export type TxType =
  | SBTransactionType
  | SBOrderType
  | ProcessedTxType
  | FiatSBAndSwapTransactionType
