import React, { ReactNode, useMemo } from 'react'
import { FormattedMessage } from 'react-intl'
import { Icon } from '@blockchain-com/constellation'

import { Text } from 'blockchain-info-components'
import { Flex } from 'components/Flex'

import { ChartBalancePanelComponent } from './types'

export const ChartBalancePanel: ChartBalancePanelComponent = ({
  coinCode,
  pastHourDelta,
  pastHourPrice,
  price
}) => {
  const isPositive: boolean = useMemo(() => {
    return pastHourDelta > 0
  }, [pastHourDelta])

  const arrowIcon: ReactNode = useMemo(() => {
    if (isPositive) {
      return <Icon name='arrowUp' size='sm' color='green600' />
    }

    return <Icon name='arrowDown' size='sm' color='red600' />
  }, [isPositive])

  const textColor: 'green600' | 'red600' = useMemo(() => {
    if (isPositive) {
      return 'green600'
    }

    return 'red600'
  }, [isPositive])

  const formattedPercentage = useMemo(() => {
    return (pastHourDelta * 100).toFixed(2)
  }, [pastHourDelta])

  return (
    <Flex gap={8} flexDirection='column'>
      <Text color='grey900' weight={600} size='12px' lineHeight='16px'>
        <FormattedMessage
          id='chart-view.chart-balance-panel.price'
          defaultMessage='{coinCode} Price'
          values={{
            coinCode
          }}
        />
      </Text>

      <Text color='grey900' weight={600} size='40px' lineHeight='50px'>
        {price}
      </Text>

      <Flex gap={8} alignItems='center'>
        {arrowIcon}

        <Text color={textColor} weight={600} size='16px' lineHeight='24px'>
          {pastHourPrice}
        </Text>

        <Text color={textColor} weight={600} size='16px' lineHeight='24px'>
          {`(${formattedPercentage}%)`}
        </Text>

        <Text color='grey400' weight={600} size='16px' lineHeight='24px'>
          <FormattedMessage
            id='chart-view.chart-balance-panel.past-hour'
            defaultMessage='Past Hour'
          />
        </Text>
      </Flex>
    </Flex>
  )
}
