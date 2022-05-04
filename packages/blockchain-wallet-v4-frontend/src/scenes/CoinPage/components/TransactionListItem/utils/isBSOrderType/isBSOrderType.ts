import { BSOrderType } from '@core/types'
import { TransactionItem } from 'hooks'

const isBSOrderType = (transaction: TransactionItem): transaction is BSOrderType => {
  const bsTransaction = transaction as BSOrderType

  const hasId = typeof bsTransaction.id === 'string'
  const hasInsertedAt = typeof bsTransaction.insertedAt === 'string'
  const hasAmount = typeof bsTransaction.pair === 'string'
  const hasState = typeof bsTransaction.state === 'string'

  return hasId && hasInsertedAt && hasAmount && hasState
}

export default isBSOrderType
