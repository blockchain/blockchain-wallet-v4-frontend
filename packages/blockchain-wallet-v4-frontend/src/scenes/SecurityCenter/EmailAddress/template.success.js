import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import { reduxForm } from 'redux-form'
import { Button, Link, Text } from 'blockchain-info-components'
import {
  SecurityComponent,
  SecurityContainer,
  SecurityDescription,
  SecurityHeader,
  SecurityIcon,
  SecuritySummary,
  IconContainer
} from 'components/Security'

import ChangeEmailSteps from '../Components/ChangeEmailSteps'
import EmailVerificationSteps from '../Components/EmailVerificationSteps'
import media from 'services/ResponsiveService'

const EmailExplanation = styled.div``
const ChangeEmailText = styled(Text)`
  cursor: pointer;
  margin-top: 5px;
  font-size: 10px;
  @media (min-width: 320px) and (max-width: 991px) {
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
  height: auto;
  span {
    white-space: initial;
  }
  @media (min-width: 320px) and (max-width: 991px) {
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
  opacity: ${props => (props.success ? 0.3 : 1)};
  display: grid;
  grid-template-columns: 15% 85%;
  ${media.mobile`
    display: flex;
  `};
`
const GridContainer = styled(SecurityContainer)`
  grid-template-columns: 85% 15%;
  ${media.mobile`
    padding: 0px;
  `};
`
const FieldsContainer = styled.div`
  display: grid;
  grid-template-columns: 15% 85%;
  ${media.mobile`
    display: flex;
  `};
`
const ResendContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 8px;
  div:first-of-type {
    margin-right: 5px;
  }
  ${media.mobile`
    flex-direction: column;
    margin-top: 15px;
  `};
`
const EmailSecuritySummary = styled(SecuritySummary)`
  ${media.mobile`
    display: inline;
  `};
`
const EmailAddress = props => {
  const {
    data,
    ui,
    handleSubmitVerification,
    handleResend,
    invalid,
    code
  } = props
  const { email, verified, failed } = data
  const isVerified = verified === 1

  const uiHelper = () =>
    !ui.verifyToggled && !ui.changeEmailToggled && !props.alone

  const securityHeaderHelper = () => {
    if (!ui.verifyToggled && !ui.changeEmailToggled && !props.alone) {
      if (isVerified) {
        return (
          <FormattedMessage
            id='scenes.security.email.verifiedtitle'
            defaultMessage='Email Address'
          />
        )
      }
      return (
        <FormattedMessage
          id='scenes.security.email.unverifiedemail.title'
          defaultMessage='Verify Email Address'
        />
      )
    }
    if (ui.changeEmailToggled) {
      return (
        <FormattedMessage
          id='scenes.security.email.verifiedemail.change'
          defaultMessage='Change Email Address'
        />
      )
    }
    return (
      <FormattedMessage
        id='scenes.security.email.unverifiedemail.verifyemail'
        defaultMessage='Verify Email Address'
      />
    )
  }

  const securityDescriptionHelper = () => {
    if (!ui.verifyToggled && !ui.changeEmailToggled && !props.alone) {
      if (isVerified) {
        return (
          <React.Fragment>
            <EmailExplanation>
              <FormattedMessage
                id='scenes.security.email.verifieddescription'
                defaultMessage='You’ve verified '
              />
              <span>
                &nbsp;
                {email}
              </span>
              <FormattedMessage
                id='scenes.security.email.verifieddescription2'
                defaultMessage='. Select ‘Change Email’ to modify this existing address. '
              />
              <FormattedMessage
                id='scenes.security.email.verifieddescription3'
                defaultMessage=' We will use this email to authorize logins, send payment notifications, and notify you of wallet updates.'
              />
            </EmailExplanation>
          </React.Fragment>
        )
      }
      return (
        <EmailExplanation>
          <FormattedMessage
            id='scenes.security.email.unverifieddescription'
            defaultMessage='We have sent a verification email to '
          />
          <span>
            &nbsp;
            {email}
          </span>
          <FormattedMessage
            id='scenes.security.email.unverifieddescription2'
            defaultMessage='. Please enter the code you’ve received to your email in order to complete the verification process. We will use this email to authorize logins, send payment notifications, and notify you of wallet updates.'
          />
        </EmailExplanation>
      )
    }
    if (ui.changeEmailToggled) {
      return (
        <FormattedMessage
          id='scenes.security.email.yourverifiedemailaddress'
          defaultMessage='Your verified email address is used to send login codes when suspicious or unusual activity is detected, to remind you of your wallet login ID, and to send payment alerts when you receive funds.'
        />
      )
    }
    return (
      <React.Fragment>
        <Text size='14px' weight={200}>
          <FormattedMessage
            id='scenes.security.email.verify.wehavesentcode'
            defaultMessage='We have sent a verification code to'
          />
          <span>
            &nbsp;
            {email}
          </span>
          <FormattedMessage
            id='scenes.security.email.verify.pleaseenter'
            defaultMessage='.  Please enter this code below to complete your email verification process.'
          />
        </Text>
        <ResendContainer>
          <Text size='14px' weight={200}>
            <FormattedMessage
              id='scenes.security.email.verify.didnotreceive'
              defaultMessage='Didn’t receive the verification email?'
            />
          </Text>
          <Link onClick={props.handleResend} size='14px' weight={300}>
            <FormattedMessage
              id='scenes.security.email.verify.resend'
              defaultMessage='Resend email'
            />
          </Link>
        </ResendContainer>
      </React.Fragment>
    )
  }

  const renderFields = () => {
    if (!ui.verifyToggled && !ui.changeEmailToggled && !props.alone) return null
    else if (ui.changeEmailToggled) {
      return (
        <ChangeEmailSteps
          handleEmailChangeCancel={props.handleEmailChangeCancel}
          handleEmailChangeSubmit={props.handleEmailChangeSubmit}
          invalid={invalid}
        />
      )
    } else {
      return (
        <EmailVerificationSteps
          failed={failed}
          handleSubmitVerification={handleSubmitVerification}
          handleResend={handleResend}
          success={ui.successToggled}
          emailCode={code}
        />
      )
    }
  }

  return (
    <GridContainer>
      <IconAndHeaderContainer success={ui.successToggled}>
        <IconContainer>
          <SecurityIcon name='email' enabled={isVerified} />
        </IconContainer>
        <EmailSecuritySummary>
          <SecurityHeader>{securityHeaderHelper()}</SecurityHeader>
          <SecurityDescription>
            {securityDescriptionHelper()}
          </SecurityDescription>
        </EmailSecuritySummary>
      </IconAndHeaderContainer>
      <EmailSecurityComponent>
        {uiHelper() && !verified ? (
          <React.Fragment>
            <EmailButton nature='primary' onClick={props.handleVerifyClick}>
              <FormattedMessage
                id='scenes.security.email.settings.updateform.sendcode'
                defaultMessage='Send Code'
              />
            </EmailButton>
            <ChangeEmailText
              color='brand-secondary'
              weight={300}
              onClick={props.handleChangeEmailView}
            >
              <FormattedMessage
                id='scenes.security.email.upateform.changetext'
                defaultMessage='Change Your Email'
              />
            </ChangeEmailText>
          </React.Fragment>
        ) : null}
        {uiHelper() && verified ? (
          <EmailButton nature='primary' onClick={props.handleChangeEmailView}>
            <FormattedMessage
              id='scenes.security.email.settings.updateform.change'
              defaultMessage='Change Email'
            />
          </EmailButton>
        ) : null}
      </EmailSecurityComponent>
      <FieldsContainer>
        <div />
        {renderFields()}
      </FieldsContainer>
    </GridContainer>
  )
}

export default reduxForm({ form: 'securityEmailAddress' })(EmailAddress)
