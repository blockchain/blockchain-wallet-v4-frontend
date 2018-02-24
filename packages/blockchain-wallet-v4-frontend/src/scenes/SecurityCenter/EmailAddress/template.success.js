import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import { Button, Text } from 'blockchain-info-components'

import { reduxForm } from 'redux-form'
import { SecurityComponent, SecurityContainer, SecurityDescription, SecurityHeader, SecurityIcon, SecuritySummary } from 'components/Security'

import ChangeEmailSteps from '../Components/ChangeEmailSteps'
import EmailVerificationSteps from '../Components/EmailVerificationSteps'

const EmailExplanation = styled.div`
`
const ChangeEmailText = styled(Text)`
  cursor: pointer;
  margin-top: 5px;
`
const IconContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 25px;
`
const EmailSecurityComponent = styled(SecurityComponent)`
  align-items: center;
  button:first-of-type {
    margin-bottom: 5px;
  }
`

const EmailAddress = (props) => {
  const { data, ui, handleSubmitVerification, handleResend, invalid } = props
  const { email, verified, failed } = data
  const isVerified = verified === 1

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
            ? <ChangeEmailSteps handleEmailChangeCancel={props.handleEmailChangeCancel} handleEmailChangeSubmit={props.handleEmailChangeSubmit} invalid={invalid} email={email} />
            : <EmailVerificationSteps failed={failed} email={email} handleSubmitVerification={handleSubmitVerification} handleResend={handleResend} />
      }
      <EmailSecurityComponent>
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
      </EmailSecurityComponent>
    </SecurityContainer>
  )
}

export default reduxForm({ form: 'securityEmailAddress' })(EmailAddress)
