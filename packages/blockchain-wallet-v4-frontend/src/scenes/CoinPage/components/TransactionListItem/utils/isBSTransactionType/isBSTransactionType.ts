import { BSTransactionType } from '@core/types'
import { TransactionItem } from 'hooks'

const isBSTransactionType = (transaction: TransactionItem): transaction is BSTransactionType => {
  const bsTransaction = transaction as BSTransactionType

  const hasId = typeof bsTransaction.id === 'string'
  const hasInsertedAt = typeof bsTransaction.insertedAt === 'string'
  const hasAmount = typeof bsTransaction.amount === 'string'
  const hasState = typeof bsTransaction.state === 'string'

  return hasId && hasInsertedAt && hasAmount && hasState
}

export default isBSTransactionType
