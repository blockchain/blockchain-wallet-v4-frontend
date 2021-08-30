import React from 'react'
import { FormattedMessage } from 'react-intl'
import moment, { Moment } from 'moment'

import { PaymentMethod } from 'core/types'

import { SBPaymentTypes } from '../../../../blockchain-wallet-v4/src/network/api/simpleBuy/types'
import { RecurringBuyPeriods } from '../../data/components/recurringBuy/types'
import { ActionEnum } from '../../data/types'

const RECURRING_BUY_PERIOD_FETCH = 'RECURRING_BUY_PERIOD_FETCH'

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

const getPeriodText = (period: RecurringBuyPeriods): React.ReactNode => {
  let text
  switch (period) {
    default:
    case RecurringBuyPeriods.DAILY:
      text = (
        <FormattedMessage
          id='modals.recurringbuys.timeframe.every_day'
          defaultMessage='Every day'
        />
      )
      break
    case RecurringBuyPeriods.WEEKLY:
      text = <FormattedMessage id='copy.once_a_week' defaultMessage='Once a Week' />
      break
    case RecurringBuyPeriods.BI_WEEKLY:
      text = <FormattedMessage id='copy.twice_a_month' defaultMessage='Twice a Month' />
      break
    case RecurringBuyPeriods.MONTHLY:
      text = <FormattedMessage id='copy.once_a_month' defaultMessage='Once a Month' />
      break
  }
  return text
}

const getActionText = (action: ActionEnum, nextDate: string | number) => {
  let text
  let isToday = false
  let date: Moment | string = moment()

  if (nextDate) {
    isToday = moment(nextDate).calendar().startsWith('Today')
    date = moment(nextDate)
  }

  date = date.format('ddd, MMMM Do')

  switch (action) {
    default:
    case ActionEnum.BUY:
      text = isToday ? (
        <FormattedMessage
          id='scenes.coin.recurringbuy.next_buy_is_today'
          defaultMessage='Next Buy is Today'
        />
      ) : (
        <FormattedMessage
          id='scenes.coin.recurringbuy.next_buy_on_date'
          defaultMessage='Next Buy on {date}'
          values={{ date }}
        />
      )
      break
    case ActionEnum.SELL:
      text = (
        <FormattedMessage
          id='scenes.coin.recurringbuy.next_sell_on_date'
          defaultMessage='Next Sell on {date}'
          values={{ date }}
        />
      )
      break
    case ActionEnum.DEPOSIT:
      text = (
        <FormattedMessage
          id='scenes.coin.recurringbuy.next_deposit_on_date'
          defaultMessage='Next Deposit on {date}'
          values={{ date }}
        />
      )
      break
    case ActionEnum.WITHDRAWAL:
      text = (
        <FormattedMessage
          id='scenes.coin.recurringbuy.next_withdrawal_on_date'
          defaultMessage='Next Withdrawal on {date}'
          values={{ date }}
        />
      )
      break
    case ActionEnum.SWAP:
      text = (
        <FormattedMessage
          id='scenes.coin.recurringbuy.next_swap_on_date'
          defaultMessage='Next Swap on {date}'
          values={{ date }}
        />
      )
      break
  }
  return text
}

const getPaymentMethodText = (paymentMethod: SBPaymentTypes) => {
  let text
  switch (paymentMethod) {
    case SBPaymentTypes.BANK_TRANSFER:
    case SBPaymentTypes.LINK_BANK:
    case SBPaymentTypes.BANK_ACCOUNT:
      text = <FormattedMessage id='copy.bank_account' defaultMessage='Bank Account' />
      break
    case SBPaymentTypes.FUNDS:
      text = <FormattedMessage id='copy.wallet_funds' defaultMessage='Wallet Funds' />
      break
    case SBPaymentTypes.PAYMENT_CARD:
    case SBPaymentTypes.USER_CARD:
      text = <FormattedMessage id='simplebuy.confirm.payment_card' defaultMessage='Credit Card' />
      break
    default:
      text = <>{paymentMethod}</>
      break
  }
  return text
}

const availableMethodsToolTip = (methods: SBPaymentTypes[]) => {
  const methodsText = methods.map((method, i, methodArray) => {
    return (
      <>
        {getPaymentMethodText(method)}
        {i + 1 === methodArray.length ? '' : ', '}
      </>
    )
  })
  return (
    <FormattedMessage
      id='modals.recurringbuys.available_methods_tool_tip'
      defaultMessage='Recurring Buys are only available for these methods at this time: {methods}'
      values={{ methods: methodsText }}
    />
  )
}

export {
  availableMethodsToolTip,
  getActionText,
  getPaymentMethodText,
  getPeriodForSuccess,
  getPeriodSubTitleText,
  getPeriodText,
  getPeriodTitleText,
  RECURRING_BUY_PERIOD_FETCH
}
