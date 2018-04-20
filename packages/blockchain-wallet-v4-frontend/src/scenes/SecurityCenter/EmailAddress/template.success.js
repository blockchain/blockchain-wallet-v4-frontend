import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import { Button, Text, Icon } from 'blockchain-info-components'

import { reduxForm } from 'redux-form'
import { SecurityComponent, SecurityContainer, SecurityDescription, SecurityHeader, SecurityIcon, SecuritySummary, SuccessOverlay, IconContainer } from 'components/Security'

import ChangeEmailSteps from '../Components/ChangeEmailSteps'
import EmailVerificationSteps from '../Components/EmailVerificationSteps'

const EmailExplanation = styled.div`
`
const ChangeEmailText = styled(Text)`
  cursor: pointer;
  margin-top: 5px;
  margin-right: 12px;

  `
const EmailSecurityComponent = styled(SecurityComponent)`
  button:first-of-type {
    margin-bottom: 5px;
  }
`
const IconAndHeaderContainer = styled.div`
  display: grid;
  grid-template-columns: 15% 85%;
`
const GridContainer = styled(SecurityContainer)`
  grid-template-columns: 85% 15%;
`
const FieldsContainer = styled.div`
  display: grid;
  grid-template-columns: 15% 85%;
`

const EmailAddress = (props) => {
  const { data, ui, handleSubmitVerification, handleResend, invalid, code } = props
  const { email, verified, failed } = data
  const isVerified = verified === 1

  const uiHelper = () => !ui.verifyToggled && !ui.changeEmailToggled && !props.alone

  const securityHeaderHelper = () => {
    if ((!ui.verifyToggled && !ui.changeEmailToggled) && !props.alone) {
      if (isVerified) return <FormattedMessage id='scenes.security.email.verifiedtitle' defaultMessage='Email Address' />
      return <FormattedMessage id='scenes.security.email.unverifiedtitle' defaultMessage='Verify Email Address' />
    }
    if (ui.changeEmailToggled) return <FormattedMessage id='scenes.security.email.unverifiedtitle' defaultMessage='Change Email Address' />
    return <FormattedMessage id='scenes.security.email.unverifiedtitle' defaultMessage='Verify Email Address' />
  }

  const securityDescriptionHelper = () => {
    if ((!ui.verifyToggled && !ui.changeEmailToggled) && !props.alone) {
      if (isVerified) {
        return (
          <React.Fragment>
            <EmailExplanation>
              <FormattedMessage id='scenes.security.email.verifieddescription' defaultMessage='You’ve verified ' />
              {email}
              <FormattedMessage id='scenes.security.email.verifieddescription2' defaultMessage='. If you’d like to update your email, click ‘Change’ on the right to get started with your new email. ' />
            </EmailExplanation>
            <FormattedMessage id='scenes.security.email.verifieddescription3' defaultMessage=' We will use this email to authorize logins, send payment notifications, and notify you of wallet updates.' />
          </React.Fragment>
        )
      }
      return (
        <EmailExplanation>
          <FormattedMessage id='scenes.security.email.unverifieddescription' defaultMessage='We have sent a verification email to ' />
          {email}
          <FormattedMessage id='scenes.security.email.unverifieddescription2' defaultMessage='. Please enter the code that you’ve received to your email in order to complete the verification process.' />
          <FormattedMessage id='scenes.security.email.unverifieddescription3' defaultMessage='We will use this email to authorize logins, send payment notifications, and notify you of wallet updates.' />
        </EmailExplanation>
      )
    }
    if (ui.changeEmailToggled) return <FormattedMessage id='scenes.security.email.verifyemailaddress' defaultMessage='Your verified email address is used to send login codes when suspicious or unusual activity is detected, to remind you of your wallet login ID, and to send payment alerts when you receive funds.' />
    return (
      <React.Fragment>
        <FormattedMessage id='scenes.security.email.verifyemailaddress' defaultMessage='We have sent a verification code to ' />
        {email}
        <FormattedMessage id='scenes.security.email.verifyemailaddress2' defaultMessage='. Please open the email and enter the code below to complete the verification process.' />
      </React.Fragment>
    )
  }

  const renderFields = () => {
    if ((!ui.verifyToggled && !ui.changeEmailToggled) && !props.alone) return null
    else if (ui.changeEmailToggled) return <ChangeEmailSteps handleEmailChangeCancel={props.handleEmailChangeCancel} handleEmailChangeSubmit={props.handleEmailChangeSubmit} invalid={invalid} />
    else return <EmailVerificationSteps failed={failed} handleSubmitVerification={handleSubmitVerification} handleResend={handleResend} success={ui.successToggled} emailCode={code} />
  }

  return (
    <GridContainer>
      <IconAndHeaderContainer>
        <SuccessOverlay success={ui.successToggled}>
          <Icon name='checkmark-in-circle' size='150px' color='success' />
          <Text size='14px' weight={300} color='success'>
            <FormattedMessage id='scenes.security.email.success' defaultMessage="Congrats! You've successfully verified your email!" />
          </Text>
        </SuccessOverlay>
        <IconContainer>
          <SecurityIcon name='email' enabled={isVerified} />
        </IconContainer>
        <SecuritySummary>
          <SecurityHeader>
            { securityHeaderHelper() }
          </SecurityHeader>
          <SecurityDescription>
            { securityDescriptionHelper() }
          </SecurityDescription>
        </SecuritySummary>
      </IconAndHeaderContainer>
      <EmailSecurityComponent>
        {
          uiHelper() && !verified
            ? <React.Fragment>
              <Button nature='primary' onClick={props.handleVerifyClick}>
                <FormattedMessage id='scenes.security.email.settings.updateform.change' defaultMessage='Enter Code' />
              </Button>
              <ChangeEmailText color='brand-secondary' size='12px' weight={300} onClick={props.handleChangeEmailView}>
                <FormattedMessage id='scenes.security.email.upateform.changetext' defaultMessage='Change Your Email' />
              </ChangeEmailText>
            </React.Fragment>
            : null
        }
        {
          uiHelper() && verified
            ? <Button nature='primary' onClick={props.handleChangeEmailView}>
              <FormattedMessage id='scenes.security.email.settings.updateform.change' defaultMessage='Change Email' />
            </Button>
            : null
        }
      </EmailSecurityComponent>
      <FieldsContainer>
        <div />
        { renderFields() }
      </FieldsContainer>
    </GridContainer>
  )
}

export default reduxForm({ form: 'securityEmailAddress' })(EmailAddress)
