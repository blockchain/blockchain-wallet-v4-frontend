import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { Button, ButtonGroup } from 'blockchain-info-components'
import { Form, FormGroup, FormItem, FormLabel, PasswordBox } from 'components/Form'
import { SettingWrapper } from 'components/Setting'
import {
  required,
  validStrongPassword,
  validPasswordConfirmation,
  validCurrentPassword,
  isNotCurrentPassword
} from 'services/FormHelper'

const ButtonWrapper = styled(ButtonGroup)`
  margin-top: 5px;
  & > :first-child {
    margin-right: 5px;
  }
`

const validatePasswordConfirmation = validPasswordConfirmation('newPassword')

const Settings = (props) => {
  const {
    updateToggled,
    handleToggle,
    handleSubmit,
    submitting,
    invalid,
    handleCancel
  } = props

  return (
    <SettingWrapper>
      { !updateToggled &&
        <Button nature='primary' onClick={handleToggle}>
          <FormattedMessage id='scenes.securitysettings.advanced.walletpassword.settings.change' defaultMessage='Change' />
        </Button>
      }
      { updateToggled &&
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <FormItem>
              <FormLabel for='currentPassword'>
                <FormattedMessage id='scenes.securitysettings.advanced.walletpassword.settings.current' defaultMessage='Current Password:' />
              </FormLabel>
              <Field name='currentPassword' component={PasswordBox} validate={[validCurrentPassword]} />
            </FormItem>
            <FormItem style={{marginTop: '5px'}}>
              <FormLabel for='newPassword'>
                <FormattedMessage id='scenes.securitysettings.advanced.walletpassword.settings.new' defaultMessage='New Password:' />
              </FormLabel>
              <Field name='newPassword' component={PasswordBox} validate={[validStrongPassword, isNotCurrentPassword]} score />
            </FormItem>
            <FormItem style={{marginTop: '5px'}}>
              <FormLabel for='walletPasswordConfirmation'>
                <FormattedMessage id='scenes.securitysettings.advanced.walletpassword.settings.confirm' defaultMessage='Confirm Password:' />
              </FormLabel>
              <Field name='walletPasswordConfirmation' validate={[required, validatePasswordConfirmation]} component={PasswordBox} />
            </FormItem>
          </FormGroup>
          <ButtonWrapper>
            <Button nature='empty' capitalize onClick={handleCancel}>
              <FormattedMessage id='scenes.securitysettings.advanced.walletpassword.settings.cancel' defaultMessage='Cancel' />
            </Button>
            <Button type='submit' nature='primary' capitalize disabled={submitting || invalid}>
              <FormattedMessage id='scenes.securitysettings.advanced.walletpassword.settings.save' defaultMessage='Save' />
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
  handleSubmit: PropTypes.func.isRequired
}

export default reduxForm({ form: 'settingWalletPassword' })(Settings)
