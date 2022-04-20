import React from 'react'
import { FormattedMessage } from 'react-intl'
import { addWeeks, format } from 'date-fns'

import { RecurringBuyPeriods } from 'data/types'

const getPeriodTitleText = (period: RecurringBuyPeriods): React.ReactNode => {
  let text
  switch (period) {
    default:
    case RecurringBuyPeriods.DAILY:
      text = (
        <FormattedMessage id='modals.recurringbuys.time_options.daily' defaultMessage='Daily' />
      )
      break
    case RecurringBuyPeriods.WEEKLY:
      text = (
        <FormattedMessage id='modals.recurringbuys.time_options.weekly' defaultMessage='Weekly' />
      )
      break
    case RecurringBuyPeriods.BI_WEEKLY:
      text = (
        <FormattedMessage
          id='modals.recurringbuys.time_options.bi_weekly'
          defaultMessage='Twice a Month'
        />
      )
      break
    case RecurringBuyPeriods.MONTHLY:
      text = (
        <FormattedMessage id='modals.recurringbuys.time_options.monthly' defaultMessage='Monthly' />
      )
      break
  }
  return text
}

const getPeriodSubTitleText = (period: RecurringBuyPeriods): React.ReactNode => {
  let text
  const date = new Date()
  switch (period) {
    default:
    case RecurringBuyPeriods.DAILY:
      text = <></>
      break
    case RecurringBuyPeriods.WEEKLY:
      text = <>On {format(date, 'EEEE')}s</>
      break
    case RecurringBuyPeriods.BI_WEEKLY:
      text = (
        <>
          On the {format(date, 'do')} and {format(addWeeks(date, 2), 'do')}
        </>
      )
      break
    case RecurringBuyPeriods.MONTHLY:
      text = <>On the {format(date, 'do')}</>
      break
  }
  return text
}

export { getPeriodSubTitleText, getPeriodTitleText }
