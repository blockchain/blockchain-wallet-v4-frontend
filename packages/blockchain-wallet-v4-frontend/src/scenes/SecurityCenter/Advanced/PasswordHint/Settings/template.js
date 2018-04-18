import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'

import { Button, ButtonGroup, Text } from 'blockchain-info-components'
import { TextBox } from 'components/Form'
import { SettingForm, SettingWrapper } from 'components/Setting'
import Hint from './Hint'

const Settings = (props) => {
  const { updateToggled, handleToggle, handleClick, submitting, invalid } = props
  return (
    <SettingWrapper>
      <Hint />
      <Button nature='primary' onClick={handleToggle}>
        <FormattedMessage id='scenes.securitysettings.basicsecurity.passwordhint.settings.change' defaultMessage='Change' />
      </Button>
      { updateToggled &&
        <SettingForm>
          <Field name='passwordHint' component={TextBox} />
          <ButtonGroup>
            <Button nature='empty' capitalize onClick={handleToggle}>
              <FormattedMessage id='scenes.securitysettings.basicsecurity.passwordhint.settings.cancel' defaultMessage='Cancel' />
            </Button>
            <Button nature='primary' capitalize disabled={submitting || invalid} onClick={handleClick}>
              <FormattedMessage id='scenes.securitysettings.basicsecurity.passwordhint.settings.save' defaultMessage='Change' />
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

export default reduxForm({ form: 'settingPasswordHint' })(Settings)
