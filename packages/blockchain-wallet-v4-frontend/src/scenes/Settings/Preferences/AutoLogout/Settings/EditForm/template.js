import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'

import { Button, ButtonGroup } from 'blockchain-info-components'
import { NumberBox, FormGroup, FormItem } from 'components/Form'
import { SettingForm, SettingWrapper } from 'components/Setting'
import { isValidAutoLogoutTime } from './validation'

const Settings = (props) => {
  const { handleToggle, handleClick, submitting, invalid } = props

  return (
    <SettingWrapper>
      <SettingForm onSubmit={handleClick}>
        <FormGroup>
          <FormItem>
            <Field name='autoLogoutTime' component={NumberBox} validate={[isValidAutoLogoutTime]} />
          </FormItem>
        </FormGroup>
        <ButtonGroup>
          <Button nature='empty' capitalize onClick={handleToggle}>
            <FormattedMessage id='scenes.preferences.autologout.settings.updateform.cancel' defaultMessage='Cancel' />
          </Button>
          <Button nature='primary' capitalize disabled={submitting || invalid} onClick={handleClick}>
            <FormattedMessage id='scenes.preferences.autologout.settings.updateform.save' defaultMessage='Save' />
          </Button>
        </ButtonGroup>
      </SettingForm>
    </SettingWrapper>
  )
}

Settings.propTypes = {
  handleToggle: PropTypes.func.isRequired,
  handleClick: PropTypes.func.isRequired
}

export default reduxForm({ form: 'settingAutoLogoutTime' })(Settings)
