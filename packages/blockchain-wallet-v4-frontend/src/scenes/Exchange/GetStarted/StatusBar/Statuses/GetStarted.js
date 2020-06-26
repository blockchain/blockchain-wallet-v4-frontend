import { Button, Text } from 'blockchain-info-components'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import React from 'react'
import styled from 'styled-components'

const ActionButton = styled(Button).attrs({ nature: 'primary' })`
  font-weight: 600;
  width: 264px;
  height: 48px;
`

const GetStarted = () => (
  <LinkContainer to='/swap/profile'>
    <ActionButton>
      <Text color='white' size='16px' weight={600} data-e2e='swapGetStarted'>
        <FormattedMessage
          id='scenes.exchange.getstarted.status.getstarted.button'
          defaultMessage='Get Started'
        />
      </Text>
    </ActionButton>
  </LinkContainer>
)

export default GetStarted
