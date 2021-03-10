import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Button, Image, Link, Text } from 'blockchain-info-components'

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

const Error = props => {
  const { error } = props

  return (
    <Wrapper>
      {error && error.includes('already been verified') ? (
        <React.Fragment>
          <LogoWrapper>
            <Image name='email-success' width='75px' height='75px' />
          </LogoWrapper>
          <Text
            size='18px'
            weight={500}
            color='marketing-primary'
            style={{ 'margin-top': '10px' }}
          >
            <FormattedMessage
              id='scenes.verifyemailtoken.error.alreadyverified.title'
              defaultMessage='Your email is already verified.'
            />
          </Text>
          <Text style={{ marginTop: '8px' }} size='15px' weight={400}>
            <FormattedMessage
              id='scenes.verifyemailtoken.error.alreadyverified.message'
              defaultMessage='If this was not you, feel free to contact us.'
            />
          </Text>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <LogoWrapper>
            <Image name='email-error' width='75px' height='75px' />
          </LogoWrapper>
          <Text
            size='18px'
            weight={500}
            color='marketing-primary'
            style={{ 'margin-top': '10px' }}
          >
            <FormattedMessage
              id='scenes.verifyemailtoken.error'
              defaultMessage='Something went wrong.'
            />
          </Text>
          <Text style={{ marginTop: '8px' }} size='15px' weight={400}>
            <FormattedMessage
              id='scenes.verifyemailtoken.error.tryagain'
              defaultMessage='Try logging in again or contact support.'
            />
          </Text>
        </React.Fragment>
      )}
      <Link target='_blank' href='https://support.blockchain.com/'>
        <Button
          nature='primary'
          fullwidth
          style={{ marginTop: '20px' }}
          height='50px'
        >
          <FormattedMessage
            id='buttons.contact_support'
            defaultMessage='Contact Support'
          />
        </Button>
      </Link>
    </Wrapper>
  )
}

export default Error
