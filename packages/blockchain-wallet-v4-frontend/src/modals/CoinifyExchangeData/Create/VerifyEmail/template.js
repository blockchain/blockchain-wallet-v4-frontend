import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { Text, Button } from 'blockchain-info-components'
import { TextBox } from 'components/Form'
import { required } from 'services/FormHelper'
import { Form, ColLeft, ColRight, InputWrapper, PartnerHeader, PartnerSubHeader, ButtonWrapper, EmailHelper } from 'components/BuySell/Signup'

const EmailInput = styled.div`
  display: flex;
  margin-top: 25px;
  flex-direction: column;
`

const VerifyEmail = (props) => {
  const { emailVerifiedError, invalid, onSubmit, resendCode, ui, updateUI } = props

  const emailHelper = () => {
    switch (true) {
      case emailVerifiedError: return <FormattedMessage id='coinifyexchangedata.create.verifyemail.helper.error' defaultMessage="That code doesn't match. {resend} or {changeEmail}." values={{ resend: <a onClick={resendCode}>Resend</a>, changeEmail: <a onClick={() => updateUI({ create: 'change_email' })}>change email</a> }} />
      case ui.codeSent: return <FormattedMessage id='coinifyexchangedata.create.verifyemail.helper.sentanothercode' defaultMessage='Another code has been sent!' />
      case !ui.codeSent: return <FormattedMessage id='coinifyexchangedata.create.verifyemail.helper.didntreceive' defaultMessage="Didn't receive your email? {resend} or {changeEmail}." values={{ resend: <a onClick={resendCode}>Resend</a>, changeEmail: <a onClick={() => updateUI({ create: 'change_email' })}>change email</a> }} />
    }
  }

  return (
    <Form onSubmit={onSubmit}>
      <ColLeft>
        <InputWrapper>
          <PartnerHeader>
            <FormattedMessage id='coinifyexchangedata.create.verifyemail.partner.header.change_email' defaultMessage="What's your email?" />
          </PartnerHeader>
          <PartnerSubHeader>
            <FormattedMessage id='coinifyexchangedata.create.verifyemail.partner.subheader.change_email' defaultMessage="Enter the email address you would like to use with your Coinify account. We'll send you a verification code to make sure it's yours." />
          </PartnerSubHeader>
          {
            ui.create === 'enter_email_code'
              ? <EmailInput>
                <Text size='14px' weight={400} style={{ 'margin-bottom': '5px' }}>
                  <FormattedMessage id='coinifyexchangedata.create.verifyemail.code' defaultMessage='Enter your verification code:' />
                </Text>
                <Field name='emailCode' onChange={() => updateUI({ uniqueEmail: true })} component={TextBox} validate={[required]} />
                <EmailHelper error={emailVerifiedError}>
                  {emailHelper()}
                </EmailHelper>
              </EmailInput>
              : <EmailInput>
                <Text size='14px' weight={400} style={{ 'margin-bottom': '5px' }}>
                  <FormattedMessage id='coinifyexchangedata.create.verifyemail.confirm' defaultMessage="Enter the email address you'd like to verify:" />
                </Text>
                <Field name='emailAddress' component={TextBox} validate={[required]} />
              </EmailInput>
          }
        </InputWrapper>
      </ColLeft>
      <ColRight>
        {
          ui.create === 'enter_email_code'
            ? <ButtonWrapper>
              <Button uppercase type='submit' nature='primary' fullwidth disabled={invalid}>
                <FormattedMessage id='coinifyexchangedata.create.verifyemail.continue' defaultMessage='Continue' />
              </Button>
            </ButtonWrapper>
            : <ButtonWrapper>
              <Button type='submit' nature='primary' fullwidth disabled={invalid}>
                <FormattedMessage id='coinifyexchangedata.create.verifyemail.sendverificationemail' defaultMessage='Send Verification Code Email' />
              </Button>
            </ButtonWrapper>
        }
      </ColRight>
    </Form>
  )
}

export default reduxForm({ form: 'coinifyVerifyEmail' })(VerifyEmail)
