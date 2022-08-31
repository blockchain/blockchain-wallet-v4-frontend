import React, { ReactNode, useMemo } from 'react'
import { FormattedMessage } from 'react-intl'
import { IconRepeat, PaletteColors } from '@blockchain-com/constellation'

import { IconCircularBackground } from 'components/IconCircularBackground'
import { StandardRow } from 'components/Rows'
import { RecurringBuyPeriods } from 'data/types'
import { useDateFormatter, useIsToday, useRecord } from 'hooks'

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
        id='copy.twice_a_month_price'
        defaultMessage='{price} Twice a Month'
        values={{ price }}
      />
    ),
    DAILY: (
      <FormattedMessage
        id='modals.recurringbuys.timeframe.every_day_price'
        defaultMessage='{price} Every day'
        values={{ price }}
      />
    ),
    MONTHLY: (
      <FormattedMessage
        id='copy.once_a_month_price'
        defaultMessage='{price} Once a Month'
        values={{ price }}
      />
    ),
    ONE_TIME: <span />,
    WEEKLY: (
      <FormattedMessage
        id='copy.once_a_week_price'
        defaultMessage='{price} Once a Week'
        values={{ price }}
      />
    )
  })

  const isToday = useIsToday(date)
  const formattedDate = useDateFormatter(date, 'EEE, MMMM do')

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
        <IconCircularBackground color='orange-400'>
          <IconRepeat color={PaletteColors['white-900']} label='icon' size='small' />
        </IconCircularBackground>
      }
      rightAction
      bottomLeftText={subtitle}
      topLeftText={title}
    />
  )
}
