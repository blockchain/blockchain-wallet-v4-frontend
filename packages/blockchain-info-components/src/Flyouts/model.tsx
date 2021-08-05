import React from 'react'
import { FormattedMessage } from 'react-intl'
import moment from 'moment'

import { RecurringBuyPeriods } from './types'

const getPeriodTitleText = (period: RecurringBuyPeriods): React.ReactNode => {
  let text
  switch (period) {
    default:
    case RecurringBuyPeriods.ONE_TIME:
      text = (
        <FormattedMessage
          id='modals.recurringbuys.time_options.one_time'
          defaultMessage='One Time'
        />
      )
      break
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

const getPeriodSubTitleText = (
  period: RecurringBuyPeriods,
  date: string | number = Date.now()
): React.ReactNode => {
  let text
  const startDate = moment(date)
  switch (period) {
    default:
    case RecurringBuyPeriods.DAILY:
      text = <></>
      break
    case RecurringBuyPeriods.WEEKLY:
      text = <>On {startDate.format('dddd')}s</>
      break
    case RecurringBuyPeriods.BI_WEEKLY:
      text = (
        <>
          On the {startDate.format('Do')} and {startDate.add(2, 'weeks').format('Do')}
        </>
      )
      break
    case RecurringBuyPeriods.MONTHLY:
      text = <>On the {startDate.format('Do')}</>
      break
  }
  return text
}

const getPeriodForSuccess = (
  period: RecurringBuyPeriods,
  date: string | number = Date.now()
): React.ReactNode => {
  let text
  const startDate = moment(date)
  switch (period) {
    default:
    case RecurringBuyPeriods.DAILY:
      text = <>every day</>
      break
    case RecurringBuyPeriods.WEEKLY:
      text = <>every {startDate.format('dddd')}</>
      break
    case RecurringBuyPeriods.BI_WEEKLY:
      text = (
        <span style={{ textTransform: 'lowercase' }}>
          {getPeriodSubTitleText(period, date)} of each month
        </span>
      )
      break
    case RecurringBuyPeriods.MONTHLY:
      text = (
        <span style={{ textTransform: 'lowercase' }}>{getPeriodSubTitleText(period, date)}</span>
      )
      break
  }
  return text
}

export { getPeriodForSuccess, getPeriodSubTitleText, getPeriodTitleText }
