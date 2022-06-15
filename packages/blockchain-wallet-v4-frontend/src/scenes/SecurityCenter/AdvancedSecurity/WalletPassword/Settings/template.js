import React from 'react'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import { Field, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { Button, Text } from 'blockchain-info-components'
import Form from 'components/Form/Form'
import FormGroup from 'components/Form/FormGroup'
import FormItem from 'components/Form/FormItem'
import FormLabel from 'components/Form/FormLabel'
import PasswordBox from 'components/Form/PasswordBox'
import { SettingWrapper } from 'components/Setting'
import {
  isNotCurrentPassword,
  required,
  validCurrentPassword,
  validPasswordConfirmation,
  validStrongPassword
} from 'services/forms'

const Wrapper = styled(SettingWrapper)`
  width: 400px;
`
const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 5px;
  & > :first-child {
    margin-right: 5px;
  }
`
const FormItemSpaced = styled(FormItem)`
  > div {
    margin-top: 10px;
  }
`

const validatePasswordConfirmation = validPasswordConfirmation('newPassword')

const Settings = (props) => {
  const {
    handleCancel,
    handleSubmit,
    handleToggle,
    invalid,
    newWalletPasswordValue,
    submitting,
    updateToggled
  } = props

  return (
    <Wrapper>
      {!updateToggled && (
        <Button nature='primary' onClick={handleToggle} data-e2e='changeCurrentPassword'>
          <FormattedMessage
            id='scenes.securitysettings.advanced.walletpassword.settings.change'
            defaultMessage='Change'
          />
        </Button>
      )}
      {updateToggled && (
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <FormItemSpaced>
              <FormLabel htmlFor='currentPassword'>
                <FormattedMessage
                  id='scenes.securitysettings.advanced.walletpassword.settings.current'
                  defaultMessage='Current Password:'
                />
              </FormLabel>
              <Field
                noLastPass
                name='currentPassword'
                component={PasswordBox}
                validate={[validCurrentPassword]}
                data-e2e='currentPasswordInput'
              />
            </FormItemSpaced>
            <FormItemSpaced style={{ marginTop: '12px' }}>
              <FormLabel htmlFor='newPassword'>
                <FormattedMessage
                  id='scenes.securitysettings.advanced.walletpassword.settings.new'
                  defaultMessage='New Password:'
                />
              </FormLabel>
              <Field
                noLastPass
                name='newPassword'
                component={PasswordBox}
                validate={[validStrongPassword, isNotCurrentPassword]}
                data-e2e='newPasswordInput'
              />
              <div>
                <Text size='12px' weight={400} style={{ marginTop: '-8px' }}>
                  <FormattedMessage
                    id='scenes.register.passwordstrengthwarn'
                    defaultMessage='Password must be at least 8 characters in length and contain at least one uppercase letter, lowercase letter, number and symbol.'
                  />
                </Text>
              </div>
            </FormItemSpaced>
            <FormItemSpaced style={{ marginTop: '12px' }}>
              <FormLabel htmlFor='walletPasswordConfirmation'>
                <FormattedMessage
                  id='scenes.securitysettings.advanced.walletpassword.settings.confirm'
                  defaultMessage='Confirm Password:'
                />
              </FormLabel>
              <Field
                noLastPass
                name='walletPasswordConfirmation'
                validate={[required, validatePasswordConfirmation]}
                component={PasswordBox}
                data-e2e='confirmPasswordInput'
              />
            </FormItemSpaced>
          </FormGroup>
          <ButtonWrapper>
            <Button
              nature='empty'
              capitalize
              onClick={handleCancel}
              data-e2e='cancelPasswordChangeButton'
            >
              <FormattedMessage id='buttons.cancel' defaultMessage='Cancel' />
            </Button>
            <Button
              type='submit'
              nature='primary'
              capitalize
              disabled={submitting || invalid}
              data-e2e='confirmPasswordChangeButton'
            >
              <FormattedMessage
                id='scenes.securitysettings.advanced.walletpassword.settings.save'
                defaultMessage='Save'
              />
            </Button>
          </ButtonWrapper>
        </Form>
      )}
    </Wrapper>
  )
}

Settings.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleToggle: PropTypes.func.isRequired,
  updateToggled: PropTypes.bool.isRequired
}

export default reduxForm({ form: 'settingWalletPassword' })(Settings)
