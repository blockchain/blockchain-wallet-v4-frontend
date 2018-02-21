import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Text, Button, Banner } from 'blockchain-info-components'
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
    width: 50%;
  }
  button {
    margin-left: 0px;
  }
  justify-content: space-between;
  margin-bottom: 15px;
  margin-top: 20px;
`
const CancelText = styled(Text)`
  cursor: pointer;
  margin-top: 5px;
`
const PaddingBottom = styled.div` margin-bottom: 10px; `

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
        <Button nature='primary' onClick={props.handleEmailChangeSubmit} disabled={props.invalid}>
          <FormattedMessage id='scenes.preferences.email.settings.updateform.verify' defaultMessage='Change' />
        </Button>
      </ChangeEmailWrapper>
      <Banner type='caution' size='12px' weight={200} width='130%'>
        <FormattedMessage id='scenes.security.email.changeemail' defaultMessage='This will change your wallets email address, but the email address you signed up to Buy Bitcoin with will remain the same.' />
      </Banner>
      <PaddingBottom />
    </SecuritySummary>
  )
}

export default ChangeEmailSteps
