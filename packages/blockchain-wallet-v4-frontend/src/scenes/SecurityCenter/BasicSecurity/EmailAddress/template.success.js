/* stylelint-disable */
import React from 'react'
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl'
import { reduxForm } from 'redux-form'
import styled from 'styled-components'

import { Button, Text } from 'blockchain-info-components'
import { media } from 'services/styles'

import {
  IconContainer,
  SecurityComponent,
  SecurityContainer,
  SecurityDescription,
  SecurityHeader,
  SecurityIcon,
  SecuritySummary
} from '../../components'
import ChangeEmailSteps from './ChangeEmailSteps'

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
const EmailSecuritySummary = styled(SecuritySummary)`
  ${media.mobile`
    display: inline;
  `};
`
const EmailAddress = props => {
  const { data, invalid, uiState } = props
  const { email, verified } = data
  const isVerified = verified === 1

  const uiHelper = () => !uiState.verifyToggled && !uiState.isEditing

  const securityHeaderHelper = () => {
    if (!uiState.verifyToggled && !uiState.isEditing) {
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
    if (uiState.isEditing) {
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
    if (!uiState.verifyToggled && !uiState.isEditing) {
      if (isVerified) {
        return (
          <React.Fragment>
            <EmailExplanation>
              <FormattedHTMLMessage
                id='scenes.security.email.verifieddescription.success'
                defaultMessage='You’ve verified <b>{email}</b>. Select "Change Email" to modify this existing address. We will use this email to authorize logins, send payment notifications, and notify you of wallet updates.'
                values={{ email }}
              />
            </EmailExplanation>
          </React.Fragment>
        )
      }
      return (
        <EmailExplanation>
          <FormattedHTMLMessage
            id='scenes.security.email.unverifiedemaildescription'
            defaultMessage='We have sent a verification email to <b>{email}</b>. Please click on the email that you’ve received to verify your email. We’ll use this email to authorize logins, send payment notifications, and notify you of wallet updates.'
            values={{ email }}
          />
        </EmailExplanation>
      )
    }
    if (uiState.isEditing) {
      return (
        <FormattedMessage
          id='scenes.security.email.yourverifiedemailaddress'
          defaultMessage='Your verified email address is used to send login codes when suspicious or unusual activity is detected. We can also remind you of your wallet login ID, and send you payments alerts when you receive funds.'
        />
      )
    }
  }

  const renderFields = () => {
    if (!uiState.verifyToggled && !uiState.isEditing) return null
    else if (uiState.isEditing) {
      return (
        <ChangeEmailSteps
          handleEmailChangeCancel={props.handleEmailChangeCancel}
          handleEmailChangeSubmit={props.handleEmailChangeSubmit}
          invalid={invalid}
        />
      )
    } else {
      return null
    }
  }

  return (
    <GridContainer>
      <IconAndHeaderContainer success={uiState.successToggled}>
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
          <>
            <EmailButton nature='primary' onClick={props.handleVerifyClick}>
              <FormattedMessage
                id='scenes.security.email.settings.updateform.resendemail'
                defaultMessage='Resend Email'
              />
            </EmailButton>
            <ChangeEmailText
              color='blue600'
              weight={400}
              onClick={props.handleChangeEmailView}
              data-e2e='changeYourEmailLink'
            >
              <FormattedMessage
                id='scenes.security.email.updateform.change'
                defaultMessage='Change Email'
              />
            </ChangeEmailText>
          </>
        ) : null}
        {uiHelper() && verified ? (
          <Button
            nature='primary'
            onClick={props.handleChangeEmailView}
            data-e2e='changeEmailButton'
          >
            <FormattedMessage
              id='scenes.security.email.settings.updateform.change'
              defaultMessage='Change Email'
            />
          </Button>
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
