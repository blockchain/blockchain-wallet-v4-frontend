import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'

import { Button, ButtonGroup, Text } from 'blockchain-info-components'
import { TextBox } from 'components/Form'
import { SettingForm, SettingWrapper } from 'components/Setting'
import { validEmail } from 'services/FormHelper'

const Settings = (props) => {
  const { updateToggled, verifyToggled, handleToggle, handleClick, handleResend, email, submitting, invalid } = props

  return (
    <SettingWrapper>
      <Button nature='primary' onClick={handleToggle}>
        <FormattedMessage id='scenes.preferences.email.settings.updateform.change' defaultMessage='Change Email' />
      </Button>
      {updateToggled &&
        <SettingForm>
          <Text size='14px' weight={300} color='error'>
            <FormattedMessage id='scenes.preferences.email.settings.warning' defaultMessage="This will change your wallet's email address, but the email address you signed up to Buy Bitcoin with will remain the same." />
          </Text>
          <Field name='emailAddress' validate={[validEmail]} component={TextBox} />
          <ButtonGroup>
            <Button nature='empty' capitalize onClick={handleToggle}>
              <FormattedMessage id='scenes.preferences.email.settings.updateform.cancel' defaultMessage='Cancel' />
            </Button>
            <Button nature='primary' capitalize disabled={submitting || invalid} onClick={handleClick}>
              <FormattedMessage id='scenes.preferences.email.settings.updateform.save' defaultMessage='Save' />
            </Button>
          </ButtonGroup>
        </SettingForm>
      }
      {!updateToggled && verifyToggled &&
        <SettingForm>
          <Text size='14px' weight={300}>
            <FormattedMessage id='scenes.preferences.email.settings.verifyform.explain' defaultMessage='We have sent you an email with a link to verify your email address.' />
          </Text>
          <ButtonGroup>
            <Button nature='empty' capitalize onClick={handleToggle}>
              <FormattedMessage id='scenes.preferences.email.settings.verifyform.cancel' defaultMessage='Cancel' />
            </Button>
            <Button nature='primary' onClick={handleResend} capitalize>
              <FormattedMessage id='scenes.preferences.email.settings.verifyform.resend' defaultMessage='Resend' />
            </Button>
          </ButtonGroup>
        </SettingForm>
      }
    </SettingWrapper>
  )
}

Settings.propTypes = {
  email: PropTypes.string.isRequired,
  updateToggled: PropTypes.bool.isRequired,
  verifyToggled: PropTypes.bool.isRequired,
  handleToggle: PropTypes.func.isRequired,
  handleClick: PropTypes.func.isRequired,
  handleResend: PropTypes.func.isRequired
}

export default reduxForm({ form: 'settingEmailAddress' })(Settings)
