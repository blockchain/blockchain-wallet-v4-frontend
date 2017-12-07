import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'

import { Button, ButtonGroup, Text } from 'blockchain-info-components'
import { NumberBox } from 'components/Form'
import { SettingForm, SettingWrapper } from 'components/Setting'
import { validPasswordStretchingNumber } from 'services/FormHelper'

const Settings = (props) => {
  const { updateToggled, handleToggle, handleClick, submitting, invalid, currentStretch } = props
  return (
    <SettingWrapper>
      {currentStretch &&
        <Text>{currentStretch}</Text>
      }
      <Button nature='primary' onClick={handleToggle}>
        <FormattedMessage id='scenes.securitysettings.advancedsettings.passwordstretching.settings.change' defaultMessage='Change' />
      </Button>
      {updateToggled &&
        <SettingForm>
          <Text size='14px' weight={300}>
            <FormattedMessage id='scenes.securitysettings.advancedsettings.passwordstretching.settings.label' defaultMessage='Password Stretching (PBKDF2)' />
          </Text>
          <Field name='passwordStretching' component={NumberBox} validate={validPasswordStretchingNumber} />
          <ButtonGroup>
            <Button nature='empty' capitalize onClick={handleToggle}>
              <FormattedMessage id='scenes.securitysettings.advancedsettings.passwordstretching.settings.cancel' defaultMessage='Cancel' />
            </Button>
            <Button nature='primary' capitalize disabled={submitting || invalid} onClick={handleClick}>
              <FormattedMessage id='scenes.securitysettings.advancedsettings.passwordstretching.settings.save' defaultMessage='Change' />
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

export default reduxForm({ form: 'settingPasswordStretching' })(Settings)
