import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'

const Content = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`

const AuthenticityCheckStep = props => {
  return (
    <Content>
      <Text size='18px' weight={500}>
        <FormattedMessage
          id='modals.lockboxsetup.authenticitycheck.title'
          defaultMessage='Device Authenticity'
        />
      </Text>
      {props.children}
    </Content>
  )
}

export default AuthenticityCheckStep
