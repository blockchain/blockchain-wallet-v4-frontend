import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'
import styled from 'styled-components'

import {
  SettingComponent,
  SettingContainer,
  SettingDescription,
  SettingHeader,
  SettingSummary,
  SettingForm,
  SettingWrapper
} from 'components/Setting'
import { Button, Text } from 'blockchain-info-components'
import { NumberBox } from 'components/Form'
import { validPasswordStretchingNumber } from 'services/FormHelper'

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
    updateToggled,
    handleToggle,
    handleSubmit,
    submitting,
    invalid,
    currentStretch
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
          {currentStretch && <CurrentText>{currentStretch}</CurrentText>}
          {!updateToggled && (
            <Button nature='primary' onClick={handleToggle}>
              <FormattedMessage
                id='scenes.securitycenter.advanced.passwordstretching.edit'
                defaultMessage='Edit'
              />
            </Button>
          )}
          {updateToggled && (
            <SettingForm onSubmit={handleSubmit}>
              <Field
                name='passwordStretching'
                component={NumberBox}
                validate={validPasswordStretchingNumber}
              />
              <ButtonWrapper>
                <Button nature='empty' capitalize onClick={handleToggle}>
                  <FormattedMessage
                    id='scenes.securitycenter.advanced.passwordstretching.cancel'
                    defaultMessage='Cancel'
                  />
                </Button>
                <Button
                  type='submit'
                  nature='primary'
                  capitalize
                  disabled={submitting || invalid}
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
