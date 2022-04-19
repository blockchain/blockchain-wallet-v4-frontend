import { FC, MouseEventHandler } from 'react'

import { FiatType } from '@core/types'
import { RecurringBuyPeriods } from 'data/types'

export type Period = 'DAILY' | 'WEEKLY' | 'BI_WEEKLY' | 'MONTHLY'

export type RecurringBuyListItemProps = {
  currency: FiatType
  date: Date
  onClick?: MouseEventHandler<HTMLDivElement>
  period: RecurringBuyPeriods
  value: number
}

export type RecurringBuyListItemComponent = FC<RecurringBuyListItemProps>
