import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Text } from 'blockchain-info-components'
import { Card } from 'components/Card'
import { Flex } from 'components/Flex'
import { Padding } from 'components/Padding'

import { HoldingsCardComponent } from './types'

export const HoldingsCard: HoldingsCardComponent = ({ actions, coinCode, coinTotal, total }) => {
  return (
    <Card borderWidth={1} borderRadius='md'>
      <Padding all={16}>
        <Flex flexDirection='column' gap={16}>
          <Text color='grey600' size='14px' weight={500} lineHeight='20px'>
            <FormattedMessage
              id='scenes.coin.holdings_card.total'
              defaultMessage='Your Total {coinCode}'
              values={{
                coinCode
              }}
            />
          </Text>

          <Flex flexDirection='column'>
            <Text color='grey900' weight={600} size='24px' lineHeight='32px'>
              {total}
            </Text>

            <Text color='grey600' size='14px' lineHeight='20px' weight={500}>
              {coinTotal}
            </Text>
          </Flex>

          {!!actions?.length && <Flex gap={8}>{actions}</Flex>}
        </Flex>
      </Padding>
    </Card>
  )
}
