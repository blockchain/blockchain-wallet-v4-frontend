import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { BlockchainLoader, Text } from 'blockchain-info-components'
import { LogoWrapper } from 'components/Public'

const Wrapper = styled.div`
  display: flex;
  text-align: center;
  align-items: center;
  flex-direction: column;
`

const Loading = props => {
  return (
    <Wrapper>
      <LogoWrapper>
        <BlockchainLoader width='40px' height='40px' />
        <Text weight={300}>Blockchain Wallet</Text>
      </LogoWrapper>
      <Text size='16px' weight={300} style={{ 'margin-top': '25px' }}>
        <FormattedMessage
          id='scenes.verifyemailtoken.loading'
          defaultMessage="We're verifying your email address. Please wait..."
        />
      </Text>
    </Wrapper>
  )
}

export default Loading
