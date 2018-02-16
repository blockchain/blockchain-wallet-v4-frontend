import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import { Button, Text, Link, Icon } from 'blockchain-info-components'
import { TextBox } from 'components/Form'

import { validEmail, validEmailCode } from 'services/FormHelper'

import { Field, reduxForm } from 'redux-form'

import { SecurityComponent, SecurityContainer, SecurityDescription, SecurityHeader, SecurityIcon, SecuritySummary } from 'components/Security'

const EmailExplanation = styled.div`
`
const ChangeEmailText = styled(Text)`
  cursor: pointer;
  margin-top: 5px;
`
const EmailCodeWrapper = styled.form`
  width: 100%;
  display: flex;
  flex-direction: row;
  button {
    margin-left: 100px;
  }
`
const ChangeEmailWrapper = EmailCodeWrapper.extend`
  align-items: center;
  div:first-of-type {
    width: 45%;
  }
  button {
    margin-left: 0px;
  }
  justify-content: space-between;
`
const CancelText = ChangeEmailText.extend`
  margin-top: 0px;
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
const IconContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 25px;
`

const EmailAddress = (props) => {
  const { data, ui } = props
  const { email, verified, failed } = data
  const isVerified = verified === 1

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
        <EmailCodeWrapper onSubmit={props.handleSubmitVerification}>
          <Field name='emailCode' validate={[validEmailCode]} component={TextBox} placeholder='123AB' onPaste={props.handleEmailCodePaste} />
          <Button nature='primary' type='submit'>
            <FormattedMessage id='scenes.preferences.email.settings.updateform.verify' defaultMessage='Verify Code' />
          </Button>
        </EmailCodeWrapper>
        {
          failed
            ? <EmailChangeWarning size='12px' color='error'>
              <FormattedMessage id='scenes.security.email.verifyemailaddress2' defaultMessage='Your verification code is incorrect. Please double check your email and try again.' />
              <Link size='12px' onClick={props.handleResend}>Get a new verification code</Link>
            </EmailChangeWarning>
            : null
        }
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
          <Field name='changeEmail' validate={[validEmail]} component={TextBox} placeholder='email@email.com' />
          <CancelText weight={300} size='12px' onClick={props.handleEmailChangeCancel}>Cancel</CancelText >
          <Button nature='primary' onClick={props.handleEmailChangeSubmit}>
            <FormattedMessage id='scenes.preferences.email.settings.updateform.verify' defaultMessage='Change' />
          </Button>
        </ChangeEmailWrapper>
        <EmailChangeWarning size='12px' weight={200}>
          <Icon name='alert' />
          <FormattedMessage id='scenes.security.email.changeemail' defaultMessage='This will change your wallets email address, but the email address you signed up to Buy Bitcoin with will remain the same.' />
        </EmailChangeWarning>
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
              <FormattedMessage id='scenes.security.email.verifieddescription2' defaultMessage='. If you’d like to update your email, click ‘Change’ on the right to get started with your new email. ' />
            </EmailExplanation>
            <FormattedMessage id='scenes.security.email.verifieddescription3' defaultMessage=' We will use this email to authorize logins, send payment notifications, and notify you of wallet updates.' />
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
      <IconContainer>
        <SecurityIcon name='email' enabled={isVerified} />
      </IconContainer>
      {
        (!ui.verifyToggled && !ui.changeEmailToggled) && !props.alone
          ? renderInitial()
          : ui.changeEmailToggled
            ? renderChangeEmailSteps()
            : renderVerificationSteps()
      }
      <SecurityComponent>
        {
          !verified && !ui.verifyToggled && !ui.changeEmailToggled && !props.alone
            ? <Button nature='primary' onClick={props.handleVerifyClick}>
              <FormattedMessage id='scenes.preferences.email.settings.updateform.change' defaultMessage='Enter Code' />
            </Button>
            : null
        }
        {
          !ui.verifyToggled && !ui.changeEmailToggled && !props.alone
            ? <ChangeEmailText color='brand-secondary' size='12px' weight={300} onClick={props.handleChangeEmailView}>
              <FormattedMessage id='scenes.securitycenter.email.upateform.changetext' defaultMessage='Change Your Email' />
            </ChangeEmailText>
            : null
        }
      </SecurityComponent>
    </SecurityContainer>
  )
}

export default reduxForm({ form: 'securityEmailAddress' })(EmailAddress)
