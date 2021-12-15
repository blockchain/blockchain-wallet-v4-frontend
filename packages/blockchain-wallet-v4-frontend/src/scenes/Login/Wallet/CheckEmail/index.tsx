import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Button, Icon, Text } from 'blockchain-info-components'
import { Wrapper } from 'components/Public'
import { LoginSteps } from 'data/types'
import { media } from 'services/styles'

import { Props as OwnProps } from '../..'
import { BackArrowFormHeader, CircleBackground, SignUpLink, WrapperWithPadding } from '../../model'

const FormBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const LoginWrapper = styled(Wrapper)`
  display: flex;
  flex-direction: column;
  padding: 32px 0 24px;
  ${media.mobile`
  padding: 16px 0;
`}
`

const CheckEmail = (props: Props) => {
  return (
    <LoginWrapper>
      <WrapperWithPadding>
        <BackArrowFormHeader {...props} handleBackArrowClick={props.handleBackArrowClick} />
        <FormBody>
          <CircleBackground color='blue600'>
            <Icon name='computer' color='white' size='24px' />
          </CircleBackground>
          <Text color='grey900' size='20px' weight={600} lineHeight='1.5'>
            <FormattedMessage id='copy.verifyyourdevice' defaultMessage='Verify Your Device' />
          </Text>
          <Text
            color='grey900'
            size='16px'
            weight={500}
            lineHeight='1.5'
            style={{ margin: '8px 0 24px 0', textAlign: 'center' }}
          >
            <FormattedMessage
              id='scenes.login.checkemail'
              defaultMessage='If you have an account registered with this email address, you will receive an email with a link to verify your device.'
            />
          </Text>
        </FormBody>
        <Button
          type='submit'
          nature='empty-blue'
          fullwidth
          height='48px'
          data-e2e='loginResendEmail'
        >
          <FormattedMessage id='buttons.email_didnt_arrive' defaultMessage="Email didn't arrive?" />
        </Button>
      </WrapperWithPadding>
      <SignUpLink />
    </LoginWrapper>
  )
}

type Props = OwnProps & {
  setStep: (step: LoginSteps) => void
}

export default CheckEmail
