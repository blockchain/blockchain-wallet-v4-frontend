import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Flex, IconRewardsCircle, PaletteColors } from '@blockchain-com/constellation'

import { Button, Text } from 'blockchain-info-components'

import { MessageContainer } from './Message.model'

const NotGoldTierMessage = ({ handleClick, maxRate }: OwnPropsType) => {
  return (
    <MessageContainer $borderColor='primary'>
      <Flex alignItems='center' gap={16}>
        <IconRewardsCircle color={PaletteColors['blue-600']} size='large' />
        <Flex flexDirection='column' justifyContent='space-between' gap={4}>
          <Text color='grey900' size='12px' weight={600}>
            <FormattedMessage
              defaultMessage='Upgrade Your Account'
              id='scenes.earn.not-gold-tier.title'
            />
          </Text>
          <Text color='grey900' size='14px' weight={500}>
            <FormattedMessage
              defaultMessage='Verify your identity and start earning up to {maxRate}% annually on your crypto.'
              id='scenes.earn.not-gold-tier.subtitle'
              values={{ maxRate }}
            />
          </Text>
        </Flex>
      </Flex>
      <Button data-e2e='earnStartKyc' nature='primary' onClick={handleClick}>
        <FormattedMessage defaultMessage='Upgrade Now' id='scenes.earn.not-gold-tier.upgradenow' />
      </Button>
    </MessageContainer>
  )
}

type OwnPropsType = {
  handleClick: () => void
  maxRate: number
}

export default NotGoldTierMessage
