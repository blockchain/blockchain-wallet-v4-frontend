import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Flex, IconAlert, SemanticColors } from '@blockchain-com/constellation'

import { Button, Text } from 'blockchain-info-components'

import { MessageContainer } from './Message.model'

const EDDAdditionalInfoMessage = ({ handleClick }: OwnPropsType) => {
  return (
    <MessageContainer $borderColor='warning'>
      <Flex alignItems='center' gap={16}>
        <IconAlert color={SemanticColors.warning} size='large' />
        <Flex flexDirection='column' justifyContent='space-between' gap={4}>
          <Text color='grey900' size='12px' weight={600}>
            <FormattedMessage
              defaultMessage='More information needed'
              id='scenes.earn.edd-additional-info-needed.title'
            />
          </Text>
          <Text color='grey900' size='14px' weight={500}>
            <FormattedMessage
              defaultMessage='Blockchain.com needs more information to verify your identity. This will speed up your future deposits and withdrawals as well as protect your account.'
              id='scenes.earn.edd-additional-info-needed.subtitle'
            />
          </Text>
        </Flex>
      </Flex>
      <Button data-e2e='earnEDDAdditionalInformationNeeded' nature='primary' onClick={handleClick}>
        <FormattedMessage
          defaultMessage='Submit Information'
          id='scenes.interest.submit_information'
        />
      </Button>
    </MessageContainer>
  )
}

type OwnPropsType = {
  handleClick: () => void
}

export default EDDAdditionalInfoMessage
