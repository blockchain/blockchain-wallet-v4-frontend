import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Text, Link, Button } from 'blockchain-info-components'
import styled from 'styled-components'
import { SecurityDescription, SecurityHeader, SecuritySummary } from 'components/Security'
import { Field } from 'redux-form'
import { TextBox } from 'components/Form'

import { validEmailCode } from 'services/FormHelper'

const EmailCodeWrapper = styled.form`
  width: 100%;
  display: flex;
  flex-direction: row;
  button {
    margin-left: 100px;
  }
`
const EmailChangeWarning = styled(Text)`
  margin-top: 25px;
  background: #FFCF62;
  padding: 5px;
  width: 130%;
  span:first-of-type {
    padding-right: 5px;
  }
`

function EmailVerificationSteps (props) {
  const { email, failed, handleSubmitVerification, handleResend } = props

  return (
    <SecuritySummary>
      <SecurityHeader>
        <FormattedMessage id='scenes.security.email.unverifiedtitle' defaultMessage='Verify email address' />
      </SecurityHeader>
      <SecurityDescription>
        <FormattedMessage id='scenes.security.email.verifyemailaddress' defaultMessage='We have sent a verification code to ' />
        {email}
        <FormattedMessage id='scenes.security.email.verifyemailaddress2' defaultMessage='. Please open the email and enter the code below to complete the verification process.' />
      </SecurityDescription>
      <EmailCodeWrapper onSubmit={handleSubmitVerification}>
        <Field name='emailCode' validate={[validEmailCode]} component={TextBox} placeholder='123AB' />
        <Button nature='primary' type='submit'>
          <FormattedMessage id='scenes.preferences.email.settings.updateform.verify' defaultMessage='Verify Code' />
        </Button>
      </EmailCodeWrapper>
      {
        failed
          ? <EmailChangeWarning size='12px' color='error'>
            <FormattedMessage id='scenes.security.email.verifyemailaddress2' defaultMessage='Your verification code is incorrect. Please double check your email and try again.' />
            <Link size='12px' onClick={handleResend}>Get a new verification code</Link>
          </EmailChangeWarning>
          : null
      }
    </SecuritySummary>
  )
}

export default EmailVerificationSteps
