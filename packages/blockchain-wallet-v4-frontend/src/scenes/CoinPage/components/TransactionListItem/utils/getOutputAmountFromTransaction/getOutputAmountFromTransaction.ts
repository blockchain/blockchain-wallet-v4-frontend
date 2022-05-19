import { TransactionItem } from 'hooks'

import { isBSOrderType } from '../isBSOrderType'
import { isBSTransactionType } from '../isBSTransactionType'
import { isFiatBSAndSwapTransactionType } from '../isFiatBSAndSwapTransactionType'
import { isIngestedSelfCustodyType } from '../isIngestedSelfCustodyType'
import { isProcessedTxType } from '../isProcessedTxType'

const getOutputAmountFromTransaction = (transaction: TransactionItem): string | undefined => {
  if (isBSTransactionType(transaction)) {
    return transaction.amount.value
  }

  if (isFiatBSAndSwapTransactionType(transaction)) {
    return transaction.amount.value
  }

  if (isIngestedSelfCustodyType(transaction)) {
    return transaction.amount
  }

  if (isBSOrderType(transaction)) {
    return transaction.outputQuantity
  }

  if (isProcessedTxType(transaction)) {
    return transaction.amount.toString()
  }

  return undefined
}

export default getOutputAmountFromTransaction
