import React, { ReactNode, useMemo } from 'react'
import { FormattedMessage } from 'react-intl'
import { Icon } from '@blockchain-com/constellation'
import { IconRepeat } from '@blockchain-com/icons'
import { useDateFomatter, useIsToday, useRecord } from 'blockchain-wallet-v4-frontend/src/hooks'

import { IconCircularBackground } from 'components/IconCircularBackground'
import { StandardRow } from 'components/Rows'
import { RecurringBuyPeriods } from 'data/types'

import { useFormatFiat } from '../CoinPage/hooks'
import { RecurringBuyListItemComponent } from './types'

export const RecurringBuyListItem: RecurringBuyListItemComponent = ({
  currency,
  date,
  onClick,
  period,
  value
}) => {
  const price = useFormatFiat({
    currency,
    value
  })

  const [title] = useRecord<RecurringBuyPeriods, ReactNode>(period, {
    BI_WEEKLY: (
      <FormattedMessage
        id='copy.twice_a_month'
        defaultMessage='{price} Twice a Month'
        values={{ price }}
      />
    ),
    DAILY: (
      <FormattedMessage
        id='modals.recurringbuys.timeframe.every_day'
        defaultMessage='{price} Every day'
        values={{ price }}
      />
    ),
    MONTHLY: (
      <FormattedMessage
        id='copy.once_a_month'
        defaultMessage='{price} Once a Month'
        values={{ price }}
      />
    ),
    ONE_TIME: <span />,
    WEEKLY: (
      <FormattedMessage
        id='copy.once_a_week'
        defaultMessage='{price} Once a Week'
        values={{ price }}
      />
    )
  })

  const isToday = useIsToday(date)

  const formattedDate = useDateFomatter(date, 'ddd, MMMM Do')

  const subtitle: ReactNode = useMemo(() => {
    if (isToday) {
      return (
        <FormattedMessage
          id='scenes.coinPage.recurringBuy.nextBuyIsToday'
          defaultMessage='Next Buy is Today'
        />
      )
    }

    return (
      <FormattedMessage
        id='scenes.coinPage.recurringBuy.nextBuyInTate'
        defaultMessage='Next Buy on {formattedDate}'
        values={{ formattedDate }}
      />
    )
  }, [isToday, formattedDate])

  return (
    <StandardRow
      onClick={onClick}
      icon={
        <IconCircularBackground color='orange400'>
          <Icon size='sm' color='white900' label='icon'>
            <IconRepeat />
          </Icon>
        </IconCircularBackground>
      }
      rightAction
      bottomLeftText={subtitle}
      topLeftText={title}
    />
  )
}
