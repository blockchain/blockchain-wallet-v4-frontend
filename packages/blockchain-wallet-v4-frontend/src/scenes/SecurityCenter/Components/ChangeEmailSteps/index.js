import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Text, Button, Banner } from 'blockchain-info-components'
import styled from 'styled-components'
import { SecuritySummary } from 'components/Security'
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
  margin: 20px 0px;
`
const CancelText = styled(Text)`
  cursor: pointer;
  margin-top: 5px;
`
const CustomBannerWrapper = styled.div`
  div > div > span {
    color: ${props => props.theme['gray-4']};
  }
  margin: 10px 0px;
`

function ChangeEmailSteps (props) {
  return (
    <SecuritySummary>
      <ChangeEmailWrapper>
        <Field name='changeEmail' validate={[validEmail]} component={TextBox} placeholder='email@email.com' />
        <CancelText weight={300} size='12px' onClick={props.handleEmailChangeCancel}>Cancel</CancelText>
        <Button nature='primary' onClick={props.handleEmailChangeSubmit} disabled={props.invalid}>
          <FormattedMessage id='scenes.preferences.email.settings.updateform.change' defaultMessage='Change' />
        </Button>
      </ChangeEmailWrapper>
      <CustomBannerWrapper>
        <Banner type='caution' size='20px' weight={200}>
          <FormattedMessage id='scenes.security.email.changeemail' defaultMessage="This will change your wallet's email address. The email address you use to buy or sell with will remain the same." />
        </Banner>
      </CustomBannerWrapper>
    </SecuritySummary>
  )
}

export default ChangeEmailSteps
