import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'

import { Button, ButtonGroup, Text } from 'blockchain-info-components'
import { PasswordBox } from 'components/Form'
import { SettingForm, SettingWrapper } from 'components/Setting'
import { validStrongPassword } from 'services/FormHelper'

const Settings = (props) => {
  const { updateToggled, handleToggle, handleClick, submitting, invalid, currentWalletPassword, handleCancel } = props
  return (
    <SettingWrapper>
      <Button nature='primary' onClick={handleToggle}>
        <FormattedMessage id='scenes.securitysettings.basicsecurity.walletpassword.settings.change' defaultMessage='Change' />
      </Button>
      {updateToggled &&
        <SettingForm>
          <Text size='14px' weight={300}>
            <FormattedMessage id='scenes.securitysettings.basicsecurity.walletpassword.settings.current' defaultMessage='Current Password' />
          </Text>
          <Field name='currentPassword' component={PasswordBox} validate={(value) => (value === currentWalletPassword ? undefined : 'Incorrect password')} />
          <Text size='14px' weight={300}>
            <FormattedMessage id='sscenes.securitysettings.basicsecurity.walletpassword.settings.new' defaultMessage='New Password' />
          </Text>
          <Field name='newPassword' component={PasswordBox} validate={[validStrongPassword]} score />
          <Text size='14px' weight={300}>
            <FormattedMessage id='scenes.securitysettings.basicsecurity.walletpassword.settings.confirm' defaultMessage='Confirm Password' />
          </Text>
          <Field name='walletPasswordConfirmation' validate={(value, allValues) => (value === allValues['newPassword']) ? undefined : 'Passwords do not match'} component={PasswordBox} />
          <ButtonGroup>
            <Button nature='empty' capitalize onClick={handleCancel}>
              <FormattedMessage id='scenes.securitysettings.basicsecurity.walletpassword.settings.cancel' defaultMessage='Cancel' />
            </Button>
            <Button nature='primary' capitalize disabled={submitting || invalid} onClick={handleClick}>
              <FormattedMessage id='scenes.securitysettings.basicsecurity.walletpassword.settings.save' defaultMessage='Save' />
            </Button>
          </ButtonGroup>
        </SettingForm>
      }
    </SettingWrapper>
  )
}

Settings.propTypes = {
  updateToggled: PropTypes.bool.isRequired,
  handleToggle: PropTypes.func.isRequired,
  handleClick: PropTypes.func.isRequired
}

export default reduxForm({ form: 'settingWalletPassword' })(Settings)
