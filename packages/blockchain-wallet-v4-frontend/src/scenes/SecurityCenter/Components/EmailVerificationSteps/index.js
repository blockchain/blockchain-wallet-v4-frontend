import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Link, Button, Banner } from 'blockchain-info-components'
import styled from 'styled-components'
import { SecuritySummary } from 'components/Security'
import { Field } from 'redux-form'
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
          ? <Banner type='warning' size='12px' weight={200} width='130%' row>
            <FormattedMessage id='scenes.security.email.verificationwrong' defaultMessage='Your verification code is incorrect. Please double check your email and try again.' />
            <Link size='12px' onClick={handleResend}>Get a new verification code</Link>
            <FormattedMessage id='scenes.security.email.verificationwrong.period' defaultMessage='.' />

          </Banner>
          : null
      }
    </Wrapper>
  )
}

export default EmailVerificationSteps
