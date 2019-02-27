import React from 'react'
import styled from 'styled-components'
import { Image, Text } from 'blockchain-info-components'
import { FormattedHTMLMessage } from 'react-intl'

const Wrapper = styled.div`
  display: flex;
  text-align: center;
  align-items: center;
  flex-direction: column;
`
const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
`

const Success = () => {
  return (
    <Wrapper>
      <LogoWrapper>
        <Image name='email-good' width='75px' height='75px' />
      </LogoWrapper>
      <Text
        size='18px'
        weight={400}
        color='marketing-primary'
        style={{ 'margin-top': '15px' }}
      >
        <FormattedHTMLMessage
          id='scenes.verifyemailtoken.verified'
          defaultMessage='Your email is verified!'
        />
      </Text>
      <Text style={{ marginTop: '16px' }} size='15px' weight={300}>
        <FormattedHTMLMessage
          id='scenes.verifyemailtoken.return'
          defaultMessage='Return to the previous tab to access your Blockchain Wallet.'
        />
      </Text>
    </Wrapper>
  )
}

export default Success
