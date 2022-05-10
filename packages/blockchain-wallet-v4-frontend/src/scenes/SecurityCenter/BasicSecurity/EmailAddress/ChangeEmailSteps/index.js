import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Field } from 'redux-form'
import styled from 'styled-components'

import { Button, Text } from 'blockchain-info-components'
import TextBox from 'components/Form/TextBox'
import { validEmail } from 'services/forms'
import { media } from 'services/styles'

import { SecuritySummary } from '../../../components'

const ChangeEmailWrapper = styled.div`
  width: 100%;
`
const ChangeEmailInputWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  ${media.mobile`
    display: block;
  `};
`

const StyledField = styled(Field)`
  ${media.mobile`
    margin-bottom: 10px;
  `};
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

function ChangeEmailSteps(props) {
  return (
    <SecuritySummary>
      <ChangeEmailWrapper>
        <ChangeEmailInputWrapper>
          <StyledField
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
              data-e2e='changeEmailButton'
            >
              <FormattedMessage
                id='scenes.preferences.email.settings.updateform.change'
                defaultMessage='Change'
              />
            </Button>
            <Button
              nature='empty'
              onClick={props.handleEmailChangeCancel}
              data-e2e='cancelEmailChange'
            >
              <FormattedMessage id='buttons.cancel' defaultMessage='Cancel' />
            </Button>
          </ButtonContainer>
        </ChangeEmailInputWrapper>
        <Text size='12px' color='grey500' weight={400}>
          <FormattedMessage
            id='scenes.security.email.changeemail.description'
            defaultMessage="<b>Note:</b> This will change your Blockchain.com Account's email address."
          />
        </Text>
      </ChangeEmailWrapper>
    </SecuritySummary>
  )
}

export default ChangeEmailSteps
