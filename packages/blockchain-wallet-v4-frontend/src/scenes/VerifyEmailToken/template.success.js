import React from 'react'
import styled from 'styled-components'
import { Image, Text } from 'blockchain-info-components'
import { FormattedHTMLMessage } from 'react-intl'
import { LogoWrapper } from 'components/Public'

const Wrapper = styled.div`
  display: flex;
  text-align: center;
  align-items: center;
  flex-direction: column;
`

const Success = props => {
  return (
    <Wrapper>
      <LogoWrapper>
        <Image name='blue-logo' width='50px' height='50px' />
        <Text weight={300}>Blockchain Wallet</Text>
      </LogoWrapper>
      <Text
        size='16px'
        weight={300}
        color='success'
        style={{ 'margin-top': '25px' }}
      >
        <FormattedHTMLMessage
          id='scenes.verifyemailtoken.success.verified'
          defaultMessage="You've succesfully verified your email address!"
        />
      </Text>
      <Text style={{ marginTop: '10px' }} size='16px' weight={300}>
        <FormattedHTMLMessage
          id='scenes.verifyemailtoken.success.return'
          defaultMessage='Return to the previous tab to access your wallet account.'
        />
      </Text>
    </Wrapper>
  )
}

export default Success
