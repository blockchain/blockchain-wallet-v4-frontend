import { ProcessedTxType, SBOrderType, SBTransactionType } from 'core/types'

export type TransferType = 'send' | 'receive' | 'transfer' | ''
export type TxType = SBTransactionType | SBOrderType | ProcessedTxType
