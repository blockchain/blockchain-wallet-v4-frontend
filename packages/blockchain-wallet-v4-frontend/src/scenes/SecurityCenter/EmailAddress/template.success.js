import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import { Button, Link, Text, Icon } from 'blockchain-info-components'
import { spacing } from 'services/StyleService'

import { reduxForm } from 'redux-form'
import { SecurityComponent, SecurityContainer, SecurityDescription, SecurityHeader, SecurityIcon, SecuritySummary, SuccessOverlay, IconContainer } from 'components/Security'

import ChangeEmailSteps from '../Components/ChangeEmailSteps'
import EmailVerificationSteps from '../Components/EmailVerificationSteps'

const EmailExplanation = styled.div`
`
const ChangeEmailText = styled(Text)`
  cursor: pointer;
  margin-top: 5px;
  font-size: 10px;
  @media (min-width: 400px) and (max-width: 991px) {
    font-size: 12px;
  }
  @media (min-width: 1224px) {
    font-size: 12px;
    margin-right: 12px;
  }
  `
const EmailSecurityComponent = styled(SecurityComponent)`
  button:first-of-type {
    margin-bottom: 5px;
  }
`
const EmailButton = styled(Button)`
  width: 100px;
  font-size: 12px;
  min-width: 0px;
  @media (min-width: 400px) and (max-width: 991px) {
    font-size: 14px;
    width: 140px;
  }
  @media (min-width: 1224px) {
    width: 140px;
    min-width: 0px;
    font-size: 14px;
  }
`
const IconAndHeaderContainer = styled.div`
  opacity: ${props => props.success ? 0.3 : 1};
  @media(min-width: 480px) {
    display: grid;
    grid-template-columns: 15% 85%;
  }
`
const GridContainer = styled(SecurityContainer)`
  grid-template-columns: 85% 15%;
`
const FieldsContainer = styled.div`
  display: grid;
  grid-template-columns: 15% 85%;
`
const ResendContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 8px;
  div:first-of-type {
    margin-right: 5px;
  }
 
`
const EmailAddress = (props) => {
  const { data, ui, handleSubmitVerification, handleResend, invalid, code } = props
  const { email, verified, failed } = data
  const isVerified = verified === 1

  const uiHelper = () => !ui.verifyToggled && !ui.changeEmailToggled && !props.alone

  const securityHeaderHelper = () => {
    if ((!ui.verifyToggled && !ui.changeEmailToggled) && !props.alone) {
      if (isVerified) return <FormattedMessage id='scenes.security.email.verifiedtitle' defaultMessage='Email Address' />
      return <FormattedMessage id='scenes.security.email.unverifiedemail.title' defaultMessage='Verify Email Address' />
    }
    if (ui.changeEmailToggled) return <FormattedMessage id='scenes.security.email.verifiedemail.title' defaultMessage='Change Email Address' />
    return <FormattedMessage id='scenes.security.email.unverifiedemail.title2' defaultMessage='Verify Email Address' />
  }

  const securityDescriptionHelper = () => {
    if ((!ui.verifyToggled && !ui.changeEmailToggled) && !props.alone) {
      if (isVerified) {
        return (
          <React.Fragment>
            <EmailExplanation>
              <FormattedMessage id='scenes.security.email.verifieddescription' defaultMessage='You’ve verified ' />
              {email}
              <FormattedMessage id='scenes.security.email.verifieddescription2' defaultMessage='. Select ‘Change Email’ to modify this existing address. ' />
              <FormattedMessage id='scenes.security.email.verifieddescription3' defaultMessage=' We will use this email to authorize logins, send payment notifications, and notify you of wallet updates.' />
            </EmailExplanation>
          </React.Fragment>
        )
      }
      return (
        <EmailExplanation>
          <FormattedMessage id='scenes.security.email.unverifieddescription' defaultMessage='Select ‘Send Code’ to begin verifying  ' />
          {email}
          <FormattedMessage id='scenes.security.email.unverifieddescription2' defaultMessage='. Once the code is received, please enter that code in the field. ' />
          <FormattedMessage id='scenes.security.email.unverifieddescription3' defaultMessage='We will use this email to authorize logins, send payment notifications, and notify you of wallet updates.' />
        </EmailExplanation>
      )
    }
    if (ui.changeEmailToggled) return <FormattedMessage id='scenes.security.email.verifyemailaddress' defaultMessage='Your verified email address is used to send login codes when suspicious or unusual activity is detected, to remind you of your wallet login ID, and to send payment alerts when you receive funds.' />
    return (
      <React.Fragment>
        <Text size='14px' weight={200}>
          <FormattedMessage id='scenes.security.email.verifyemailaddress1' defaultMessage='We have sent a verification code to' />
          <span>&nbsp;{email}</span>
          <FormattedMessage id='scenes.security.email.verifyemailaddress2' defaultMessage='.  Please enter this code below to complete your email verification process.' />
        </Text>
        <ResendContainer>
          <Text size='14px' weight={200}>
            <FormattedMessage id='scenes.security.email.verifyemailaddress3' defaultMessage='Didn’t receive the verification email?' />
          </Text>
          <Link onClick={props.handleResend} size='14px' weight={300}>
            <FormattedMessage id='scenes.security.email.verifyemailaddress4' defaultMessage='Resend email' />
          </Link>
        </ResendContainer>
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
      <SuccessOverlay success={ui.successToggled} style={spacing('pt-30')}>
        <Icon name='checkmark-in-circle' size='150px' color='success' />
        <Text size='14px' weight={300} color='success'>
          <FormattedMessage id='scenes.security.email.success' defaultMessage="Congrats! You've successfully verified your email!" />
        </Text>
      </SuccessOverlay>
      <IconAndHeaderContainer success={ui.successToggled}>
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
              <EmailButton nature='primary' onClick={props.handleVerifyClick}>
                <FormattedMessage id='scenes.security.email.settings.updateform.sendcode' defaultMessage='Send Code' />
              </EmailButton>
              <ChangeEmailText color='brand-secondary' weight={300} onClick={props.handleChangeEmailView}>
                <FormattedMessage id='scenes.security.email.upateform.changetext' defaultMessage='Change Your Email' />
              </ChangeEmailText>
            </React.Fragment>
            : null
        }
        {
          uiHelper() && verified
            ? <EmailButton nature='primary' onClick={props.handleChangeEmailView}>
              <FormattedMessage id='scenes.security.email.settings.updateform.change' defaultMessage='Change Email' />
            </EmailButton>
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
