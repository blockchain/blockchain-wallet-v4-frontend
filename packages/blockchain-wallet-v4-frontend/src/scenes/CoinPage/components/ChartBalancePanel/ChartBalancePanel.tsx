import React, { ReactNode, useMemo } from 'react'
import { FormattedMessage } from 'react-intl'
import { Icon } from '@blockchain-com/constellation'

import { Text } from 'blockchain-info-components'
import { Flex } from 'components/Flex'

import { ChartBalancePanelComponent } from './types'

export const ChartBalancePanel: ChartBalancePanelComponent = ({
  coinCode,
  isPositive,
  pastHourChange,
  pastHourPrice,
  price
}) => {
  const arrowIcon: ReactNode = useMemo(() => {
    if (isPositive === true) {
      return <Icon name='arrowUp' size='sm' color='green600' />
    }

    if (isPositive === false) {
      return <Icon name='arrowDown' size='sm' color='red600' />
    }
  }, [isPositive])

  const textColor: 'green600' | 'red600' | 'grey600' = useMemo(() => {
    if (isPositive === true) {
      return 'green600'
    }

    if (isPositive === false) {
      return 'red600'
    }

    return 'grey600'
  }, [isPositive])

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
          {`(${pastHourChange}%)`}
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
