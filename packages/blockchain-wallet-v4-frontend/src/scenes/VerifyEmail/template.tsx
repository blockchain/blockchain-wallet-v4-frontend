import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Button, Icon, Link, Text } from 'blockchain-info-components'
import { Wrapper } from 'components/Public'

const ContentWrapper = styled.div`
  display: flex;
  text-align: center;
  align-items: center;
  flex-direction: column;
`
const IconWrapper = styled.div`
  display: flex;
  background: ${props => props.theme['blue600']};
  height: 40px;
  width: 40px;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
`

const VerifyEmail = ({ email, resendEmail, skipVerification }: Props) => {
  return (
    <>
      <Wrapper>
        <ContentWrapper>
          <IconWrapper>
            <Icon color='white' name='email' size='24px' />
          </IconWrapper>
          <Text
            size='20px'
            weight={600}
            color='black'
            style={{ marginTop: '8px' }}
          >
            <FormattedMessage
              id='scenes.verifyemail.title'
              defaultMessage='Verify Your Email'
            />
          </Text>
          <Text
            color='grey900'
            style={{ marginTop: '8px' }}
            size='16px'
            weight={500}
          >
            <FormattedMessage
              id='scenes.verifyemail.description'
              defaultMessage='We sent a verification email to: <b>{email}</b>. Please click the link in the email to continue.'
              values={{
                email
              }}
            />
          </Text>

          <Button
            data-e2e='verifyEmail'
            fullwidth
            height='48px'
            nature='light'
            onClick={resendEmail}
            style={{ marginTop: '32px', marginBottom: '5px' }}
          >
            <Text color='blue600' size='16px' weight={600}>
              <FormattedMessage
                id='scenes.verifyemail.button'
                defaultMessage='Email didn’t arrive?'
              />
            </Text>
          </Button>
        </ContentWrapper>
      </Wrapper>

      <Link
        onClick={skipVerification}
        size='16px'
        style={{ marginTop: '40px' }}
        weight={500}
        data-e2e='verifyEmailLater'
        color='white'
      >
        <FormattedMessage
          id='scenes.verifyemail.do_it_later'
          defaultMessage='I’ll Do This Later.'
        />
      </Link>
    </>
  )
}

type Props = {
  email: string
  resendEmail: () => void
  skipVerification: () => void
}

export default VerifyEmail
