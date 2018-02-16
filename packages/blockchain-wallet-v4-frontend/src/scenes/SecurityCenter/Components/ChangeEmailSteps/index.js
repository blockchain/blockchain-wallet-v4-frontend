import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Text, Icon, Button } from 'blockchain-info-components'
import styled from 'styled-components'
import { SecurityDescription, SecurityHeader, SecuritySummary } from 'components/Security'
import { Field } from 'redux-form'
import { TextBox } from 'components/Form'

import { validEmail } from 'services/FormHelper'

const ChangeEmailWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  div:first-of-type {
    width: 45%;
  }
  button {
    margin-left: 0px;
  }
  justify-content: space-between;
`
const CancelText = styled(Text)`
  cursor: pointer;
  margin-top: 5px;
`
const EmailChangeWarning = styled(Text) `
  margin-top: 25px;
  background: #FFCF62;
  padding: 5px;
  width: 130%;
  span:first-of-type {
    padding-right: 5px;
  }
`

function ChangeEmailSteps (props) {
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

export default ChangeEmailSteps
