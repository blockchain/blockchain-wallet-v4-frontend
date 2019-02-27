import React from 'react'
import styled from 'styled-components'
import { Button, Image, Text } from 'blockchain-info-components'
import { FormattedMessage } from 'react-intl'

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

const Error = () => {
  return (
    <Wrapper>
      <LogoWrapper>
        <Image name='email-bad' width='75px' height='75px' />
      </LogoWrapper>
      <Text
        size='18px'
        weight={400}
        color='marketing-primary'
        style={{ 'margin-top': '10px' }}
      >
        <FormattedMessage
          id='scenes.verifyemailtoken.error'
          defaultMessage='Something went wrong.'
        />
      </Text>
      <Text style={{ marginTop: '8px' }} size='15px' weight={300}>
        <FormattedMessage
          id='scenes.verifyemailtoken.error.resend'
          defaultMessage='We can send you a new email and try again.'
        />
      </Text>
      <Button
        nature='primary'
        fullwidth
        style={{ marginTop: '20px' }}
        height='50px'
      >
        <FormattedMessage
          id='scenes.verifyemailtoken.error.sendagain'
          defaultMessage='Send Again'
        />
      </Button>
    </Wrapper>
  )
}

export default Error
