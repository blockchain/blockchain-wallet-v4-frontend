import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Text } from 'blockchain-info-components'
import { Card } from 'components/Card'
import { Flex } from 'components/Flex'
import { Padding, PaddingSymetric } from 'components/Padding'

import { RecurringBuyPanelComponent } from './types'

export const RecurringBuyPanel: RecurringBuyPanelComponent = ({ children }) => {
  return (
    <Card>
      <Padding top={16}>
        <Flex flexDirection='column' gap={0}>
          <PaddingSymetric horizontal={16} vertical={0}>
            <Text color='grey600' size='14px' weight={500} lineHeight='20px'>
              <FormattedMessage id='coinPage.recurringBuy.title' defaultMessage='Recurring Buys' />
            </Text>
          </PaddingSymetric>

          <div>{children}</div>
        </Flex>
      </Padding>
    </Card>
  )
}
