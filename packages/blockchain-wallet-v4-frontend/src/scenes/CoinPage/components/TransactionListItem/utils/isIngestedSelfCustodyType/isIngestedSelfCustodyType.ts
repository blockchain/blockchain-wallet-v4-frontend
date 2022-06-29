import { IngestedSelfCustodyType } from '@core/network/api/coin/types'
import { TransactionItem } from 'hooks'

const isIngestedSelfCustodyType = (
  transaction: TransactionItem
): transaction is IngestedSelfCustodyType => {
  const bsTransaction = transaction as IngestedSelfCustodyType

  const hasFee = typeof bsTransaction.fee === 'string'
  const hasFrom = typeof bsTransaction.from === 'string'
  const hasTo = typeof bsTransaction.to === 'string'

  return hasFee && hasFrom && hasTo
}

export default isIngestedSelfCustodyType
