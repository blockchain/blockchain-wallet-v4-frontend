import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Text } from 'blockchain-info-components'
import { Card } from 'components/Card'
import { Flex } from 'components/Flex'
import { Padding } from 'components/Padding'

import { RecurringBuyPanelComponent } from './types'

export const RecurringBuyPanel: RecurringBuyPanelComponent = ({ children }) => {
  return (
    <Card borderWidth={1} borderRadius='md'>
      <Padding top={16}>
        <Flex flexDirection='column' gap={0}>
          <Padding horizontal={16} vertical={0}>
            <Text color='grey600' size='14px' weight={500} lineHeight='20px'>
              <FormattedMessage id='coinPage.recurringBuy.title' defaultMessage='Recurring Buys' />
            </Text>
          </Padding>

          <div>{children}</div>
        </Flex>
      </Padding>
    </Card>
  )
}
