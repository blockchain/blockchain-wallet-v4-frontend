import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Button, Icon, Text } from 'blockchain-info-components'
import { LoginSteps } from 'data/types'

import { Props as OwnProps } from '..'
import { BackArrowFormHeader, CircleBackground, LOGIN_FORM_NAME } from '../model'

const FormBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const CheckEmail = (props: Props) => {
  const handleBackArrowClick = () => {
    props.cacheActions.removedStoredLogin()
    props.formActions.destroy(LOGIN_FORM_NAME)
    props.setStep(LoginSteps.ENTER_EMAIL_GUID)
    props.authActions.clearLoginError()
  }
  return (
    <>
      <BackArrowFormHeader {...props} handleBackArrowClick={handleBackArrowClick} />
      <FormBody>
        <CircleBackground>
          <Icon name='computer' color='white' size='24px' />
        </CircleBackground>
        <Text color='grey900' size='20px' weight={600} lineHeight='1.5'>
          <FormattedMessage id='copy.verifyyourdevice' defaultMessage='Verify Your Device' />
        </Text>
        <Text
          color='grey600'
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
      <Button type='submit' nature='empty-blue' fullwidth height='48px' data-e2e='loginResendEmail'>
        <FormattedMessage id='buttons.email_didnt_arrive' defaultMessage="Email didn't arrive?" />
      </Button>
    </>
  )
}

type Props = OwnProps & {
  setStep: (step: LoginSteps) => void
}

export default CheckEmail
