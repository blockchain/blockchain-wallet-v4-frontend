import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import { Button, Text, Link } from 'blockchain-info-components'
import { TextBox } from 'components/Form'

import { validEmailCode } from 'services/FormHelper'
import { Field, reduxForm } from 'redux-form'
import { SecurityComponent, SecurityContainer, SecurityDescription, SecurityHeader, SecurityIcon, SecuritySummary } from 'components/Security'

import ChangeEmailSteps from '../Components/ChangeEmailSteps'

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
const IconContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 25px;
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
      <ChangeEmailSteps handleEmailChangeCancel={props.handleEmailChangeCancel} handleEmailChangeSubmit={props.handleEmailChangeSubmit} />
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
