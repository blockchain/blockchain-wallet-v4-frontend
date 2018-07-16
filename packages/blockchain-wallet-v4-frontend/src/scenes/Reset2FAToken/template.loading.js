import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { BlockchainLoader, Text } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  text-align: center;
  align-items: center;
  flex-direction: column;
`

const Loading = props => {
  return (
    <Wrapper>
      <BlockchainLoader width='40px' height='40px' />
      <Text size='16px' weight={300} style={{ 'margin-top': '25px' }}>
        <FormattedMessage
          id='scenes.reset2fatoken.loading'
          defaultMessage="We're handling your Two-Step Verification reset request. Please wait..."
        />
      </Text>
    </Wrapper>
  )
}

export default Loading
