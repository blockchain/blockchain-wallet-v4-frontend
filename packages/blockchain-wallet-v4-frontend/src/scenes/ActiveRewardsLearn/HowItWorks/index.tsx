import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Flex, SemanticColors, Text } from '@blockchain-com/constellation'

import Labels from './Labels'
import Scenarios from './Scenarios'

const HowItWorks = () => {
  return (
    <>
      <Flex flexDirection='column' gap={8}>
        <Text color={SemanticColors.title} variant='title3'>
          <FormattedMessage
            id='scenes.earn.active-rewards-learn.how-it-works.title'
            defaultMessage='How it works'
          />
        </Text>
        <Text color={SemanticColors.body} variant='paragraph1'>
          <FormattedMessage
            id='scenes.earn.active-rewards-learn.how-it-works.description'
            defaultMessage="Every week, Active Rewards forecasts a price for crypto assets that is higher than the market price. If you believe the price will be under the forecasted level at the end of the week, you can subscribe to a strategy that pays an annual rate.{br}{br} Let's see some scenarios with the following values:"
            values={{ br: <br /> }}
          />
        </Text>
        <Labels />
      </Flex>
      <Flex flexDirection='column' gap={24}>
        <Scenarios />
      </Flex>
    </>
  )
}

export default HowItWorks
