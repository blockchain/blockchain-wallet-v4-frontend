import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'
import styled from 'styled-components'
import { has } from 'ramda'

import { Button } from 'blockchain-info-components'
import {
  Form,
  FormGroup,
  FormItem,
  FormLabel,
  PasswordBox
} from 'components/Form'
import { SettingWrapper } from 'components/Setting'
import {
  required,
  validPasswordConfirmation,
  validCurrentPassword,
  isNotCurrentPassword
} from 'services/FormHelper'

// load zxcvbn dependency async and set on window
require.ensure(
  ['zxcvbn'],
  require => (window.zxcvbn = require('zxcvbn')),
  'zxcvbn'
)
const validStrongPassword = password => {
  return password !== undefined && window.zxcvbn(password).score > 1
    ? undefined
    : () => (
        <FormattedMessage
          id='scenes.securitysettings.advanced.walletpassword.invalidstrongpassword'
          defaultMessage='Your password is not strong enough'
        />
      )
}

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 5px;
  & > :first-child {
    margin-right: 5px;
  }
`
const FormItemSpaced = styled(FormItem)`
  > div {
    margin-top: 10px;
  }
`

const validatePasswordConfirmation = validPasswordConfirmation('newPassword')

const Settings = props => {
  const {
    updateToggled,
    handleToggle,
    handleSubmit,
    submitting,
    invalid,
    handleCancel,
    newWalletPasswordValue
  } = props

  return (
    <SettingWrapper>
      {!updateToggled && (
        <Button
          nature='primary'
          onClick={handleToggle}
          data-e2e='changeCurrentPassword'
        >
          <FormattedMessage
            id='scenes.securitysettings.advanced.walletpassword.settings.change'
            defaultMessage='Change'
          />
        </Button>
      )}
      {updateToggled && (
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <FormItemSpaced>
              <FormLabel for='currentPassword'>
                <FormattedMessage
                  id='scenes.securitysettings.advanced.walletpassword.settings.current'
                  defaultMessage='Current Password:'
                />
              </FormLabel>
              <Field
                noLastPass
                name='currentPassword'
                component={PasswordBox}
                validate={[validCurrentPassword]}
                data-e2e='currentPasswordInput'
              />
            </FormItemSpaced>
            <FormItemSpaced style={{ marginTop: '12px' }}>
              <FormLabel for='newPassword'>
                <FormattedMessage
                  id='scenes.securitysettings.advanced.walletpassword.settings.new'
                  defaultMessage='New Password:'
                />
              </FormLabel>
              <Field
                noLastPass
                name='newPassword'
                component={PasswordBox}
                validate={[validStrongPassword, isNotCurrentPassword]}
                showPasswordScore
                passwordScore={
                  has('zxcvbn', window)
                    ? window.zxcvbn(newWalletPasswordValue).score
                    : 0
                }
                data-e2e='newPasswordInput'
              />
            </FormItemSpaced>
            <FormItemSpaced style={{ marginTop: '12px' }}>
              <FormLabel for='walletPasswordConfirmation'>
                <FormattedMessage
                  id='scenes.securitysettings.advanced.walletpassword.settings.confirm'
                  defaultMessage='Confirm Password:'
                />
              </FormLabel>
              <Field
                noLastPass
                name='walletPasswordConfirmation'
                validate={[required, validatePasswordConfirmation]}
                component={PasswordBox}
                data-e2e='confirmPasswordInput'
              />
            </FormItemSpaced>
          </FormGroup>
          <ButtonWrapper>
            <Button
              nature='empty'
              capitalize
              onClick={handleCancel}
              data-e2e='cancelPasswordChangeButton'
            >
              <FormattedMessage
                id='scenes.securitysettings.advanced.walletpassword.settings.cancel'
                defaultMessage='Cancel'
              />
            </Button>
            <Button
              type='submit'
              nature='primary'
              capitalize
              disabled={submitting || invalid}
              data-e2e='confirmPasswordChangeButton'
            >
              <FormattedMessage
                id='scenes.securitysettings.advanced.walletpassword.settings.save'
                defaultMessage='Save'
              />
            </Button>
          </ButtonWrapper>
        </Form>
      )}
    </SettingWrapper>
  )
}

Settings.propTypes = {
  updateToggled: PropTypes.bool.isRequired,
  handleToggle: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired
}

export default reduxForm({ form: 'settingWalletPassword' })(Settings)
