import { FC } from 'react'

import { FiatBSAndSwapTransactionType } from '@core/types'

type CustodialTransactionListItemProps = {
  onClick?: () => void
  transaction: FiatBSAndSwapTransactionType
}

type CustodialTransactionListItemComponent = FC<CustodialTransactionListItemProps>

export type { CustodialTransactionListItemComponent, CustodialTransactionListItemProps }
