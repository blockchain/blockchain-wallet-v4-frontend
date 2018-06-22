import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import { Field } from 'redux-form'

import { Link, Button, Text, TextGroup } from 'blockchain-info-components'
import { SecuritySummary } from 'components/Security'
import { TextBox } from 'components/Form'
import { validEmailCode, required } from 'services/FormHelper'

const EmailCodeWrapper = styled.form`
  width: 100%;
  display: flex;
  flex-direction: row;
  button {
    margin-left: 25px;
  }
`
const ErrorMessage = styled(TextGroup)`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  margin-top: 10px;
`

const Wrapper = styled(SecuritySummary)`
  opacity: ${props => props.success ? 0.3 : 1};
`

function EmailVerificationSteps (props) {
  const { failed, handleSubmitVerification, handleResend, success, emailCode } = props

  return (
    <Wrapper success={success}>
      <EmailCodeWrapper onSubmit={handleSubmitVerification}>
        <Field name='emailCode' validate={[validEmailCode, required]} component={TextBox} placeholder='123AB' />
        <Button nature='primary' type='submit' disabled={!emailCode}>
          <FormattedMessage id='scenes.preferences.email.settings.updateform.verify' defaultMessage='Verify Code' />
        </Button>
      </EmailCodeWrapper>
      {
        failed
          ? (
            <ErrorMessage inline>
              <Text size='12px' weight={300} color='red'>
                <FormattedMessage id='scenes.security.email.verificationwrong' defaultMessage='Your verification code is incorrect. Please double check your email and try again.' />
              </Text>
              <span>&nbsp;</span>
              <Link size='12px' onClick={handleResend}>Get a new verification code</Link>
            </ErrorMessage>
          )
          : null
      }
    </Wrapper>
  )
}

export default EmailVerificationSteps
