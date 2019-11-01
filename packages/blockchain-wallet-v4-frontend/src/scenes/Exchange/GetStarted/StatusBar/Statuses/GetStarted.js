import React from 'react'
import styled from 'styled-components'
import { LinkContainer } from 'react-router-bootstrap'
import { FormattedMessage } from 'react-intl'

import { Button, Text } from 'blockchain-info-components'

const ActionButton = styled(Button).attrs({ nature: 'primary' })`
  font-weight: 600;
  height: 56px;
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
