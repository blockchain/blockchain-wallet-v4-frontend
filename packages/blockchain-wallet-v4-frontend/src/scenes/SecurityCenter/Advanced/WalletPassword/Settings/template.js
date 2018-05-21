import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { Button, ButtonGroup } from 'blockchain-info-components'
import { Form, FormGroup, FormItem, FormLabel, PasswordBox } from 'components/Form'
import { SettingWrapper } from 'components/Setting'
import { validStrongPassword } from 'services/FormHelper'

const ButtonWrapper = styled(ButtonGroup)`
  margin-top: 5px;
  & > :first-child {
    margin-right: 5px;
  }
`

const Settings = (props) => {
  const { updateToggled, handleToggle, handleClick, submitting, invalid, currentWalletPassword, handleCancel } = props
  return (
    <SettingWrapper>
      { !updateToggled &&
        <Button nature='primary' onClick={handleToggle}>
          <FormattedMessage id='scenes.securitysettings.basicsecurity.walletpassword.settings.change' defaultMessage='Change'/>
        </Button>
      }
      { updateToggled &&
        <Form>
          <FormGroup>
            <FormItem>
              <FormLabel for='currentPassword'>
                <FormattedMessage id='scenes.securitysettings.basicsecurity.walletpassword.settings.current' defaultMessage='Current Password:' />
              </FormLabel>
              <Field name='currentPassword' component={PasswordBox} validate={(value) => (value === currentWalletPassword ? undefined : 'Incorrect password')} />
            </FormItem>
            <FormItem style={{marginTop: '5px'}}>
              <FormLabel for='newPassword'>
                <FormattedMessage id='scenes.securitysettings.basicsecurity.walletpassword.settings.new' defaultMessage='New Password:' />
              </FormLabel>
              <Field name='newPassword' component={PasswordBox} validate={[validStrongPassword]} score />
            </FormItem>
            <FormItem style={{marginTop: '5px'}}>
              <FormLabel for='walletPasswordConfirmation'>
                <FormattedMessage id='scenes.securitysettings.basicsecurity.walletpassword.settings.confirm' defaultMessage='Current Password:' />
              </FormLabel>
              <Field name='walletPasswordConfirmation' validate={(value, allValues) => (value === allValues['newPassword']) ? undefined : 'Passwords do not match'} component={PasswordBox} />
            </FormItem>
          </FormGroup>
          <ButtonWrapper>
            <Button nature='empty' capitalize onClick={handleCancel}>
              <FormattedMessage id='scenes.securitysettings.basicsecurity.walletpassword.settings.cancel' defaultMessage='Cancel' />
            </Button>
            <Button nature='primary' capitalize disabled={submitting || invalid} onClick={handleClick}>
              <FormattedMessage id='scenes.securitysettings.basicsecurity.walletpassword.settings.save' defaultMessage='Save' />
            </Button>
          </ButtonWrapper>
        </Form>
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
