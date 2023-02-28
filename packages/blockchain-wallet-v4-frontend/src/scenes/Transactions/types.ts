import { IngestedSelfCustodyType } from '@core/network/api/coins/types'
import {
  BSOrderType,
  BSTransactionType,
  FiatBSAndSwapTransactionType,
  ProcessedTxType
} from '@core/types'

export type TransferType = 'sent' | 'received' | 'transferred' | ''
export type TxType =
  | BSTransactionType
  | BSOrderType
  | ProcessedTxType
  | FiatBSAndSwapTransactionType
  | IngestedSelfCustodyType
