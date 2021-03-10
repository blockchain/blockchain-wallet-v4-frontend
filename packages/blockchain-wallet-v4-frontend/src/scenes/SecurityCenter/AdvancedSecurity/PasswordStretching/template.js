import React from 'react'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import { Field, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { Button, Text } from 'blockchain-info-components'
import { NumberBox } from 'components/Form'
import {
  SettingComponent,
  SettingContainer,
  SettingDescription,
  SettingForm,
  SettingHeader,
  SettingSummary,
  SettingWrapper
} from 'components/Setting'
import { validPasswordStretchingNumber } from 'services/forms'

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 5px;
  & > :first-child {
    margin-right: 5px;
  }
`
const CurrentText = styled(Text)`
  margin-bottom: 10px;
`
const PasswordStretching = props => {
  const {
    currentStretch,
    handleSubmit,
    handleToggle,
    invalid,
    submitting,
    updateToggled
  } = props

  return (
    <SettingContainer>
      <SettingSummary>
        <SettingHeader>
          <FormattedMessage
            id='scenes.securitycenter.advanced.passwordstretching.title'
            defaultMessage='Password Stretching (PBKDF2)'
          />
        </SettingHeader>
        <SettingDescription>
          <FormattedMessage
            id='scenes.securitycenter.advanced.passwordstretching.description'
            defaultMessage='This increases the difficulty of discovering your password using a brute-force attack but slows down loading and saving your wallet.'
          />
        </SettingDescription>
      </SettingSummary>
      <SettingComponent>
        <SettingWrapper>
          {currentStretch && (
            <CurrentText data-e2e='currentStretchLabel'>
              {currentStretch}
            </CurrentText>
          )}
          {!updateToggled && (
            <Button
              nature='primary'
              onClick={handleToggle}
              data-e2e='editPasswordStretchingButton'
            >
              <FormattedMessage
                id='scenes.securitycenter.advanced.passwordstretching.edit'
                defaultMessage='Edit'
              />
            </Button>
          )}
          {updateToggled && (
            <SettingForm onSubmit={handleSubmit}>
              <Field
                data-e2e='passwordStretchingInput'
                name='passwordStretching'
                component={NumberBox}
                validate={validPasswordStretchingNumber}
              />
              <ButtonWrapper>
                <Button
                  nature='empty'
                  capitalize
                  onClick={handleToggle}
                  data-e2e='passwordStretchCancelButton'
                >
                  <FormattedMessage
                    id='buttons.cancel'
                    defaultMessage='Cancel'
                  />
                </Button>
                <Button
                  type='submit'
                  nature='primary'
                  capitalize
                  disabled={submitting || invalid}
                  data-e2e='cancelStretchSaveButton'
                >
                  <FormattedMessage
                    id='scenes.securitycenter.advanced.passwordstretching.save'
                    defaultMessage='Save'
                  />
                </Button>
              </ButtonWrapper>
            </SettingForm>
          )}
        </SettingWrapper>
      </SettingComponent>
    </SettingContainer>
  )
}

PasswordStretching.propTypes = {
  updateToggled: PropTypes.bool.isRequired,
  handleToggle: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired
}

export default reduxForm({
  form: 'settingPasswordStretching'
})(PasswordStretching)
