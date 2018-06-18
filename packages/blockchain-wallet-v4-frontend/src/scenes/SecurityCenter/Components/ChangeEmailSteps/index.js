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
  display: block;
  align-items: center;
  @media (min-width: 554px) {
    width: 80%;
}
`
const CancelText = styled(Text)`
  cursor: pointer;
  margin-top: 5px;
`
const CustomBannerWrapper = styled.div`
  margin: 10px 0px;
`
const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
  button {
    margin-right: 5px;
  }
`

function ChangeEmailSteps (props) {
  return (
    <SecuritySummary>
      <ChangeEmailWrapper>
        <Field name='changeEmail' validate={[validEmail]} component={TextBox} placeholder='email@email.com' />
        <ButtonContainer>
          <Button nature='primary' onClick={props.handleEmailChangeSubmit} disabled={props.invalid}>
            <FormattedMessage id='scenes.preferences.email.settings.updateform.change' defaultMessage='Change' />
          </Button>
          <CancelText weight={300} size='12px' onClick={props.handleEmailChangeCancel}>Cancel</CancelText>
        </ButtonContainer>
      </ChangeEmailWrapper>
      <CustomBannerWrapper>
        <Banner type='caution' size='20px' weight={200}>
          <Text size='12px'>
            <FormattedMessage id='scenes.security.email.changeemail.description' defaultMessage="This will change your wallet's email address. The email address you use to buy or sell with will remain the same." />
          </Text>
        </Banner>
      </CustomBannerWrapper>
    </SecuritySummary>
  )
}

export default ChangeEmailSteps
