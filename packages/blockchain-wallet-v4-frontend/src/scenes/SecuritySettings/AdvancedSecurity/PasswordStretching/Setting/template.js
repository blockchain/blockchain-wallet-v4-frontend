import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'

import { Button, ButtonGroup, Text } from 'blockchain-info-components'
import { NumberBox } from 'components/Form'
import { SettingForm, SettingWrapper } from 'components/Setting'
import { validPasswordStretchingNumber } from 'services/FormHelper'

const Setting = (props) => {
  const { updateToggled, handleToggle, handleClick, submitting, invalid, currentStretch } = props
  return (
    <SettingWrapper>
      {currentStretch &&
        <Text>{currentStretch}</Text>
      }
      <Button nature='primary' onClick={handleToggle}>
        <FormattedMessage id='scenes.security.passwordStretching.updateform.setpasswordStretching' defaultMessage='Change' />
      </Button>
      {updateToggled &&
        <SettingForm>
          <Text size='14px' weight={300}>
            <FormattedMessage id='scenes.security.passwordStretching.label' defaultMessage='Password Stretching (PBKDF2)' />
          </Text>
          <Field name='passwordStretching' component={NumberBox} validate={validPasswordStretchingNumber} />
          <ButtonGroup>
            <Button nature='empty' capitalize onClick={handleToggle}>
              <FormattedMessage id='scenes.security.passwordStretching.updateform.cancel' defaultMessage='Cancel' />
            </Button>
            <Button nature='primary' capitalize disabled={submitting || invalid} onClick={handleClick}>
              <FormattedMessage id='scenes.security.passwordStretching.updateform.save' defaultMessage='Change' />
            </Button>
          </ButtonGroup>
        </SettingForm>
      }
    </SettingWrapper>
  )
}

Setting.propTypes = {
  updateToggled: PropTypes.bool.isRequired,
  handleToggle: PropTypes.func.isRequired,
  handleClick: PropTypes.func.isRequired
}

export default reduxForm({ form: 'settingPasswordStretching' })(Setting)
