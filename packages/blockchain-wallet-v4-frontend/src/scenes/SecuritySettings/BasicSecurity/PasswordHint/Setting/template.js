import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'

import { Button, ButtonGroup, Text } from 'blockchain-info-components'
import { TextBox } from 'components/Form'
import { SettingForm, SettingWrapper } from 'components/Setting'

const Setting = (props) => {
  const { updateToggled, handleToggle, handleClick, submitting, invalid, currentHint } = props
  return (
    <SettingWrapper>
      {currentHint &&
        <Text>{currentHint}</Text>
      }
      <Button nature='primary' onClick={handleToggle}>
        <FormattedMessage id='scenes.security.passwordHint.updateform.setpasswordHint' defaultMessage='Change' />
      </Button>
      {updateToggled &&
        <SettingForm>
          <Text size='14px' weight={300}>
            <FormattedMessage id='scenes.security.passwordHint.label' defaultMessage='Password Hint' />
          </Text>
          <Field name='passwordHint' component={TextBox} />
          <ButtonGroup>
            <Button nature='empty' capitalize onClick={handleToggle}>
              <FormattedMessage id='scenes.security.passwordHint.updateform.cancel' defaultMessage='Cancel' />
            </Button>
            <Button nature='primary' capitalize disabled={submitting || invalid} onClick={handleClick}>
              <FormattedMessage id='scenes.security.passwordHint.updateform.save' defaultMessage='Change' />
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

export default reduxForm({ form: 'settingPasswordHint' })(Setting)
