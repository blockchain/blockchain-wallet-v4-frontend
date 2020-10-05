import { ProcessedTxType, SBOrderType, SBTransactionType } from 'core/types'

export type TxType = SBTransactionType | SBOrderType | ProcessedTxType
