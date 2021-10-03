import {
  FiatSBAndSwapTransactionType,
  ProcessedTxType,
  SBOrderType,
  SBTransactionType
} from 'blockchain-wallet-v4/src/types'

export type TransferType = 'sent' | 'received' | 'transferred' | ''
export type TxType =
  | SBTransactionType
  | SBOrderType
  | ProcessedTxType
  | FiatSBAndSwapTransactionType
