import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import { Button, Text } from 'blockchain-info-components'
import { TextBox } from 'components/Form'

import { Field, reduxForm } from 'redux-form'

import { SecurityComponent, SecurityContainer, SecurityDescription, SecurityHeader, SecurityIcon, SecuritySection, SecuritySummary } from 'components/Security'

const EmailExplanation = styled.div`
`
const ChangeEmailText = styled(Text)`
  cursor: pointer;
  margin-top: 5px;
`
const EmailCodeWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  button {
    margin-left: 100px;
  }
`
const ChangeEmailWrapper = EmailCodeWrapper.extend`
  align-items: center;
  input {
    margin-right: 25px;
  }
`

const EmailAddress = (props) => {
  const { data, ui } = props
  const { email, verified } = data
  const isVerified = verified === 1
  console.log('render email', props)

  const renderVerificationSteps = () => {
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
        <EmailCodeWrapper>
          <Field name='emailCode' validate={[]} component={TextBox} placeholder='123AB' />
          <Button nature='primary' onClick={props.handleSubmitVerification}>
            <FormattedMessage id='scenes.preferences.email.settings.updateform.verify' defaultMessage='Verify Code' />
          </Button>
          <Text onClick={props.handleResend}>Resend email</Text>
        </EmailCodeWrapper>
      </SecuritySummary>
    )
  }

  const renderChangeEmailSteps = () => {
    return (
      <SecuritySummary>
        <SecurityHeader>
          <FormattedMessage id='scenes.security.email.unverifiedtitle' defaultMessage='Change Email Address' />
        </SecurityHeader>
        <SecurityDescription>
          <FormattedMessage id='scenes.security.email.verifyemailaddress' defaultMessage='Your verified email address is used to send login codes when suspicious or unusual activity is detected, to remind you of your wallet login ID, and to send payment alerts when you receive funds.' />
        </SecurityDescription>
        <ChangeEmailWrapper>
          <Field name='changeEmail' validate={[]} component={TextBox} placeholder='email@email.com' />
          <Text onClick={props.handleEmailChangeCancel}>Cancel</Text>
          <Button nature='primary' onClick={props.handleEmailChangeSubmit}>
            <FormattedMessage id='scenes.preferences.email.settings.updateform.verify' defaultMessage='Change' />
          </Button>
        </ChangeEmailWrapper>
      </SecuritySummary>
    )
  }

  const renderInitial = () => {
    return (
      isVerified
        ? <SecuritySummary>
          <SecurityHeader>
            <FormattedMessage id='scenes.security.email.verifiedtitle' defaultMessage='Email address' />
          </SecurityHeader>
          <SecurityDescription>
            <EmailExplanation>
              <FormattedMessage id='scenes.security.email.verifieddescription' defaultMessage='You’ve verified ' />
              {email}
              <FormattedMessage id='scenes.security.email.verifieddescription2' defaultMessage='. If you’d like to update your email, click ‘Change’ on the right to get started with your new email.' />
            </EmailExplanation>
            <FormattedMessage id='scenes.security.email.verifieddescription3' defaultMessage='We will use this email to authorize logins, send payment notifications, and notify you of wallet updates.' />
          </SecurityDescription>
        </SecuritySummary>
        : <SecuritySummary>
          <SecurityHeader>
            <FormattedMessage id='scenes.security.email.unverifiedtitle' defaultMessage='Verify email address' />
          </SecurityHeader>
          <SecurityDescription>
            <EmailExplanation>
              <FormattedMessage id='scenes.security.email.unverifieddescription' defaultMessage='We have sent a verification email to ' />
              {email}
              <FormattedMessage id='scenes.security.email.unverifieddescription2' defaultMessage='. Please enter the code that you’ve received to your email in order to complete the verification process.' />
              <FormattedMessage id='scenes.security.email.unverifieddescription3' defaultMessage='We will use this email to authorize logins, send payment notifications, and notify you of wallet updates.' />
            </EmailExplanation>
          </SecurityDescription>
        </SecuritySummary>
    )
  }

  return (
    <SecurityContainer>
      <SecurityIcon name='email' enabled={isVerified} />
      {
        !ui.verifyToggled && !ui.changeEmailToggled
          ? renderInitial()
          : ui.changeEmailToggled
            ? renderChangeEmailSteps()
            : renderVerificationSteps()
      }
      <SecurityComponent>
        <Button nature='primary' onClick={props.handleVerifyClick}>
          <FormattedMessage id='scenes.preferences.email.settings.updateform.change' defaultMessage='Enter Code' />
        </Button>
        <ChangeEmailText color='brand-secondary' size='12px' weight={300} onClick={props.handleChangeEmailView}>
          <FormattedMessage id='scenes.securitycenter.email.upateform.changetext' defaultMessage='Change Your Email' />
        </ChangeEmailText>
      </SecurityComponent>
    </SecurityContainer>
  )
}

export default reduxForm({ form: 'securityEmailAddress' })(EmailAddress)
