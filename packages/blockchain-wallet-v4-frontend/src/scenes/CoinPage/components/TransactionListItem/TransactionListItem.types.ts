import { FC } from 'react'

import { CoinType } from '@core/types'
import { TransactionItem } from 'hooks'

type TransactionListItemProps = {
  coin: CoinType
  transaction: TransactionItem
}

type TransactionListItemComponent = FC<TransactionListItemProps>

export type { TransactionListItemComponent, TransactionListItemProps }
