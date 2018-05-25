import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { Button, ButtonGroup } from 'blockchain-info-components'
import { TextBox } from 'components/Form'
import { SettingForm, SettingWrapper } from 'components/Setting'
import Hint from './Hint'

const ButtonWrapper = styled(ButtonGroup)`
  margin-top: 5px;
  & > :first-child {
    margin-right: 5px;
  }
`

const Settings = (props) => {
  const { updateToggled, handleToggle, handleClick, submitting, invalid, handleCancel } = props
  return (
    <SettingWrapper>
      <Hint />
      { !updateToggled &&
        <Button nature='primary' onClick={handleToggle}>
          <FormattedMessage id='scenes.securitysettings.basicsecurity.passwordhint.settings.change' defaultMessage='Change'/>
        </Button>
      }
      { updateToggled &&
        <SettingForm onSubmit={handleClick}>
          <Field name='passwordHint' component={TextBox} />
          <ButtonWrapper>
            <Button nature='empty' capitalize onClick={handleCancel}>
              <FormattedMessage id='scenes.securitysettings.basicsecurity.passwordhint.settings.cancel' defaultMessage='Cancel' />
            </Button>
            <Button nature='primary' capitalize disabled={submitting || invalid} onClick={handleClick}>
              <FormattedMessage id='scenes.securitysettings.basicsecurity.passwordhint.settings.save' defaultMessage='Change' />
            </Button>
          </ButtonWrapper>
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
