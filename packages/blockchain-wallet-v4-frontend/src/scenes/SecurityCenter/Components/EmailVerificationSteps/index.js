import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Link, Button, Banner } from 'blockchain-info-components'
import styled from 'styled-components'
import { SecurityDescription, SecurityHeader, SecuritySummary } from 'components/Security'
import { Field } from 'redux-form'
import { TextBox } from 'components/Form'

import { validEmailCode } from 'services/FormHelper'

const EmailCodeWrapper = styled.form`
  width: 100%;
  display: flex;
  flex-direction: row;
  margin: 30px 0px 20px 0px;
  button {
    margin-left: 100px;
  }
`

const Wrapper = styled(SecuritySummary)`
  opacity: ${props => props.verified ? 0.3 : 1};
`

function EmailVerificationSteps (props) {
  const { email, failed, handleSubmitVerification, handleResend, success } = props

  return (
    <Wrapper verified={success}>
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
          ? <Banner type='warning' size='12px' weight={200} width='130%' row>
            <FormattedMessage id='scenes.security.email.verificationwrong' defaultMessage='Your verification code is incorrect. Please double check your email and try again.' />
            <Link size='12px' onClick={handleResend}>Get a new verification code</Link>
          </Banner>
          : null
      }
    </Wrapper>
  )
}

export default EmailVerificationSteps
