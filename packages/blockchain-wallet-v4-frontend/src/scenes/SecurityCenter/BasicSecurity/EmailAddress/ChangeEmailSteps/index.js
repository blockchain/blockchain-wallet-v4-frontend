import React from 'react'
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl'
import { Text, Button } from 'blockchain-info-components'
import styled from 'styled-components'
import { SecuritySummary } from 'components/Security'
import { Field } from 'redux-form'
import { TextBox } from 'components/Form'

import { validEmail } from 'services/FormHelper'

const ChangeEmailWrapper = styled.div`
  width: 100%;
`
const ChangeEmailInputWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`
const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 20px;
  button {
    margin-right: 5px;
  }
`

function ChangeEmailSteps (props) {
  return (
    <SecuritySummary>
      <ChangeEmailWrapper>
        <ChangeEmailInputWrapper>
          <Field
            autoFocus
            name='changeEmail'
            validate={[validEmail]}
            component={TextBox}
            placeholder='email@email.com'
          />
          <ButtonContainer>
            <Button
              nature='primary'
              onClick={props.handleEmailChangeSubmit}
              disabled={props.invalid}
            >
              <FormattedMessage
                id='scenes.preferences.email.settings.updateform.change'
                defaultMessage='Change'
              />
            </Button>
            <Button nature='empty' onClick={props.handleEmailChangeCancel}>
              <FormattedMessage
                id='scenes.preferences.email.settings.updateform.cancel'
                defaultMessage='Cancel'
              />
            </Button>
          </ButtonContainer>
        </ChangeEmailInputWrapper>
        <Text size='12px' color='gray-4' weight={200}>
          <FormattedHTMLMessage
            id='scenes.security.email.changeemail.description'
            defaultMessage='<b>Note:</b> This will change your wallet’s email address. The email address you use to buy or sell with will remain the same.'
          />
        </Text>
      </ChangeEmailWrapper>
    </SecuritySummary>
  )
}

export default ChangeEmailSteps
