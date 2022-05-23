import { CoinType } from '@core/types'
import { TransactionItem } from 'hooks'

import { isBSOrderType } from '../isBSOrderType'

const getOutputCurrencyFromTransaction = (transaction: TransactionItem): CoinType | undefined => {
  if (isBSOrderType(transaction)) return transaction.inputCurrency

  return undefined
}

export default getOutputCurrencyFromTransaction
