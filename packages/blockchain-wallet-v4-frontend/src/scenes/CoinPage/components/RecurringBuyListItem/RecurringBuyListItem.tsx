import React, { ReactNode, useMemo } from 'react'
import { FormattedMessage } from 'react-intl'
import { useDateFomatter, useIsToday, useRecord } from 'blockchain-wallet-v4-frontend/src/hooks'

import { Icon, Text } from 'blockchain-info-components'
import { ClickableArea } from 'components/ClickableArea'
import { Expanded, Flex } from 'components/Flex'
import { IconCircularBackground } from 'components/IconCircularBackground'
import { PaddingAll, PaddingSymetric } from 'components/Padding'
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

  const title = useRecord<RecurringBuyPeriods, ReactNode>(period, {
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
    <ClickableArea onClick={onClick}>
      <PaddingAll size={16}>
        <Flex>
          <Flex alignItems='center' justifyContent='center'>
            <IconCircularBackground color='orange400'>
              <Icon name='sync-regular' size='12px' color='white' />
            </IconCircularBackground>
          </Flex>

          <Expanded>
            <PaddingSymetric horizontal={16}>
              <Flex flexDirection='column'>
                <Text color='grey900' weight={600} size='16px' lineHeight='24px'>
                  {title}
                </Text>

                <Text color='grey600' weight={500} size='14px' lineHeight='20px'>
                  {subtitle}
                </Text>
              </Flex>
            </PaddingSymetric>
          </Expanded>

          <Flex alignItems='center' justifyContent='center'>
            <Icon name='chevron-right' size='24px' color='grey400' />
          </Flex>
        </Flex>
      </PaddingAll>
    </ClickableArea>
  )
}
