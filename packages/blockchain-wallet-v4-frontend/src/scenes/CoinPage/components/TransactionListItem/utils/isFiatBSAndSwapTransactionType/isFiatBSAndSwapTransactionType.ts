import { FiatBSAndSwapTransactionType } from '@core/types'
import { TransactionItem } from 'hooks'

const isFiatBSAndSwapTransactionType = (
  transaction: TransactionItem
): transaction is FiatBSAndSwapTransactionType => {
  const bsTransaction = transaction as FiatBSAndSwapTransactionType

  const hasId = typeof bsTransaction.id === 'string'
  const hasAmountMinor = typeof bsTransaction.amountMinor === 'string'

  return hasId && hasAmountMinor
}

export default isFiatBSAndSwapTransactionType
