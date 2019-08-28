import React from 'react'
import styled from 'styled-components'
import { LinkContainer } from 'react-router-bootstrap'
import { FormattedMessage } from 'react-intl'

import { Button, Text } from 'blockchain-info-components'

const ActionButton = styled(Button).attrs({ nature: 'primary' })`
  font-weight: 600;
  padding-top: 18px;
  padding-bottom: 18px;
  height: fit-content;
  max-width: 327px;
  width: 50%;

  @media (max-width: 69.375rem) {
    width: 45%;
  }

  @media (max-width: 65.5rem) {
    width: 40%;
  }

  @media (max-width: 61.25rem) {
    width: 100%;
  }
`

const GetStarted = () => (
  <LinkContainer to='/swap/profile'>
    <ActionButton>
      <Text color='white' size='16px' weight={600}>
        <FormattedMessage
          id='scenes.exchange.getstarted.status.getstarted.button'
          defaultMessage='Get Started'
        />
      </Text>
    </ActionButton>
  </LinkContainer>
)

export default GetStarted
