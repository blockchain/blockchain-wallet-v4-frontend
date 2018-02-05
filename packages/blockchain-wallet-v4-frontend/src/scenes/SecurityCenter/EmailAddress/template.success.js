import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import { Button, Text } from 'blockchain-info-components'

import { Field, reduxForm } from 'redux-form'

import { SecurityComponent, SecurityContainer, SecurityDescription, SecurityHeader, SecurityIcon, SecuritySection, SecuritySummary } from 'components/Security'
// import Settings from './Settings'

const EmailExplanation = styled.div`
`
const ChangeEmailText = styled(Text)`
  cursor: pointer;
  margin-top: 5px;
`

const EmailAddress = (props) => {
  const { data, ui } = props
  const { email, verified } = data
  const isVerified = verified === 1
  console.log('render success template', props)

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
        <Field name='emailAddress' validate={[validEmail]} component={TextBox} />
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
        !ui.verifyToggled
          ? renderInitial()
          : renderVerificationSteps()
      }
      <SecurityComponent>
        <Button nature='primary' onClick={props.handleVerifyClick}>
          <FormattedMessage id='scenes.preferences.email.settings.updateform.change' defaultMessage='Enter Code' />
        </Button>
        <ChangeEmailText color='brand-secondary' size='12px' weight={300}>
          <FormattedMessage id='scenes.securitycenter.email.upateform.changetext' defaultMessage='Change Your Email' />
        </ChangeEmailText>
      </SecurityComponent>
    </SecurityContainer>
  )
}

// export default reduxForm({ form: 'securityEmailAddress' })(EmailAddress)
export default EmailAddress
