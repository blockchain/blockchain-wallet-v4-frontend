import { ProcessedTxType } from '@core/types'
import { TransactionItem } from 'hooks'

const isProcessedTxType = (transaction: TransactionItem): transaction is ProcessedTxType => {
  const bsTransaction = transaction as ProcessedTxType

  const hasHash = typeof bsTransaction.hash === 'string'
  const hasBlockHeight =
    typeof bsTransaction.blockHeight === 'string' || typeof bsTransaction.blockHeight === 'number'

  return hasBlockHeight && hasHash
}

export default isProcessedTxType
