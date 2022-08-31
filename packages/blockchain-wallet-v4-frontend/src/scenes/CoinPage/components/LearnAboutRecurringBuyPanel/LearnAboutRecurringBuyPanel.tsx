import React from 'react'
import { FormattedMessage } from 'react-intl'
import { IconRepeat, PaletteColors } from '@blockchain-com/constellation'

import { Button, Text } from 'blockchain-info-components'
import { Card } from 'components/Card'
import { Flex } from 'components/Flex'
import { IconCircularBackground } from 'components/IconCircularBackground'
import { Padding } from 'components/Padding'

import { LearnAboutRecurringBuyPanelComponent } from './types'

export const LearnAboutRecurringBuyPanel: LearnAboutRecurringBuyPanelComponent = ({ onClick }) => {
  return (
    <Card elevation={1} borderRadius='md'>
      <Padding all={16}>
        <Flex flexDirection='column' gap={12}>
          <IconCircularBackground color='blue-000'>
            <IconRepeat color={PaletteColors['blue-600']} label='repeat' size='small' />
          </IconCircularBackground>

          <Flex flexDirection='column'>
            <Text size='20px' weight={600} lineHeight='30px' color='grey900'>
              <FormattedMessage
                id='coinPage.learnAboutRecurringBuyPanel.title'
                defaultMessage='Don’t know when to buy?'
              />
            </Text>

            <Text size='14px' lineHeight='20px' weight={500} color='grey900'>
              <FormattedMessage
                id='coinPage.learnAboutRecurringBuyPanel.body'
                defaultMessage='Timing the market is hard, which is why many investors use dollar cost averaging.'
              />
            </Text>
          </Flex>

          <Button
            data-e2e='coinPage.learnAboutRecurringBuyPanel.learnMoreButton'
            nature='empty-blue'
            onClick={onClick}
          >
            <FormattedMessage
              id='coinPage.learnAboutRecurringBuyPanel.learnMoreButton'
              defaultMessage='Learn More'
            />
          </Button>
        </Flex>
      </Padding>
    </Card>
  )
}
