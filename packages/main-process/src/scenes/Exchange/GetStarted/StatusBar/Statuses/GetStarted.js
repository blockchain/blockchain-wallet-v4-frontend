import React from 'react'
import styled from 'styled-components'
import { LinkContainer } from 'react-router-bootstrap'
import { FormattedMessage } from 'react-intl'

import { Button } from 'blockchain-info-components'

const ActionButton = styled(Button).attrs({ nature: 'primary' })`
  font-weight: 500;
`

export const GetStarted = () => (
  <LinkContainer to='/swap/profile'>
    <ActionButton>
      <FormattedMessage
        id='scenes.exchange.getstarted.status.getstarted.button'
        defaultMessage='Get Started'
      />
    </ActionButton>
  </LinkContainer>
)

export default GetStarted
