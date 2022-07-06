import {
  isBSOrderType,
  isBSTransactionType,
  isIngestedSelfCustodyType,
  isProcessedTxType
} from 'blockchain-wallet-v4-frontend/src/scenes/CoinPage/components/TransactionListItem/utils'

import { TransactionItem } from 'hooks'

import { SupportedFilters } from './filterTransactionsByWalletType.types'

const filterTransactionsByWalletType = (
  transactions: TransactionItem[],
  filter: SupportedFilters
): TransactionItem[] => {
  const mapFilterTypeToFilterCallback: Record<
    SupportedFilters,
    (transaction: TransactionItem) => boolean
  > = {
    ACCOUNT: (transaction) =>
      isProcessedTxType(transaction) || isIngestedSelfCustodyType(transaction),
    CUSTODIAL: (transaction) => isBSOrderType(transaction) || isBSTransactionType(transaction)
  }

  return transactions.filter(mapFilterTypeToFilterCallback[filter])
}

export default filterTransactionsByWalletType
