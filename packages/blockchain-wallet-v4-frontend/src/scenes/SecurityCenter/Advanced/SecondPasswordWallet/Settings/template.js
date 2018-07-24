import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { Button, ButtonGroup, Text, TextGroup } from 'blockchain-info-components'
import { Types } from 'blockchain-wallet-v4'
import { FormGroup, FormItem, FormLabel, PasswordBox } from 'components/Form'
import { SettingForm, SettingWrapper } from 'components/Setting'
import { required } from 'services/FormHelper'

const SecondPasswordWrapper = styled(SettingWrapper)`
  width: ${props => props.toggled ? '150%' : 'initial'};
`
const ButtonWrapper = styled(ButtonGroup)`
  margin-top: 5px;
  & > :first-child {
    margin-right: 5px;
  }
`

const validateSecondPassword = (value, allValues, props) => {
  return Types.Wallet.isValidSecondPwd(value, props.wallet) ? undefined : 'Second password invalid'
}
const Settings = (props) => {
  const { updateToggled, handleToggle, handleSubmit, mainPassword, submitting, invalid, secondPasswordEnabled, handleCancel } = props
  const isMainPassword = (props) => mainPassword !== props ? null : "You can't use your main password as your second password."
  if (secondPasswordEnabled) {
    return (
      <SettingWrapper>
        { !updateToggled &&
          <Button nature='primary' onClick={handleToggle}>
            <FormattedMessage id='scenes.securitysettings.advanced.secondpasswordwallet.settings.remove' defaultMessage='Remove Second Password' />
          </Button>
        }
        { updateToggled &&
          <SettingForm onSubmit={handleSubmit}>
            <Text size='14px' weight={300}>
              <FormattedMessage id='scenes.securitysettings.advanced.secondpasswordwallet.settings.label' defaultMessage='Second Password' />
            </Text>
            <Field name='secondPassword' component={PasswordBox} validate={[required, validateSecondPassword]} />
            <ButtonWrapper>
              <Button nature='empty' capitalize onClick={handleCancel}>
                <FormattedMessage id='scenes.securitysettings.advanced.secondpasswordwallet.settings.cancel' defaultMessage='Cancel' />
              </Button>
              <Button type='submit' nature='primary' capitalize disabled={submitting || invalid}>
                <FormattedMessage id='scenes.securitysettings.advanced.secondpasswordwallet.settings.remove' defaultMessage='Remove Second Password' />
              </Button>
            </ButtonWrapper>
          </SettingForm>
        }
      </SettingWrapper>
    )
  } else {
    return (
      <SecondPasswordWrapper toggled={updateToggled}>
        { !updateToggled &&
          <Button nature='primary' onClick={handleToggle}>
            <FormattedMessage id='scenes.securitysettings.advanced.secondpasswordwallet.settings.set' defaultMessage='Set Second Password' />
          </Button>
        }
        { updateToggled &&
          <SettingForm onSubmit={handleSubmit}>
            <TextGroup inline style={{'margin-bottom': '10px'}}>
              <Text size='14px' weight={300} color='error'>
                <FormattedMessage id='scenes.securitysettings.advanced.secondpasswordwallet.settings.warning' defaultMessage="We highly recommend you backup your wallet's recovery phrase before setting a second password." />
              </Text>
              <Text size='14px' weight={300} color='error'>
                <FormattedMessage id='scenes.securitysettings.advanced.secondpasswordwallet.settings.warning2' defaultMessage='Backing up your wallet will ensure your funds are safe in case you lose your password.' />
              </Text>
              <Text size='14px' weight={300} color='error'>
                <FormattedMessage id='scenes.securitysettings.advanced.secondpasswordwallet.settings.warning3' defaultMessage='For your security, we do not keep any passwords on file.' />
              </Text>
            </TextGroup>
            <FormGroup>
              <FormItem>
                <FormLabel for='secondPassword'>
                  <FormattedMessage id='scenes.securitysettings.advanced.secondpasswordwallet.settings.label2' defaultMessage='Second Password' />
                </FormLabel>
                <Field name='secondPassword' validate={[isMainPassword]} component={PasswordBox} />
              </FormItem>
              <FormItem style={{'margin-top': '10px'}}>
                <FormLabel for='secondPasswordConfirmation'>
                  <FormattedMessage id='scenes.securitysettings.advanced.secondpasswordwallet.settings.explain' defaultMessage='Confirm Second Password' />
                </FormLabel>
                <Field name='secondPasswordConfirmation' validate={(value, allValues) => (value === allValues['secondPassword']) ? undefined : 'Passwords do not match'} component={PasswordBox} />
              </FormItem>
            </FormGroup>
            <ButtonWrapper>
              <Button nature='empty' capitalize onClick={handleCancel}>
                <FormattedMessage id='scenes.securitysettings.advanced.secondpasswordwallet.settings.cancel2' defaultMessage='Cancel' />
              </Button>
              <Button nature='primary' capitalize disabled={submitting || invalid} onClick={handleSubmit}>
                <FormattedMessage id='scenes.securitysettings.advanced.secondpasswordwallet.settings.save2' defaultMessage='Save' />
              </Button>
            </ButtonWrapper>
          </SettingForm>
        }
      </SecondPasswordWrapper>
    )
  }
}

Settings.propTypes = {
  updateToggled: PropTypes.bool.isRequired,
  handleToggle: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
}

export default reduxForm({ form: 'settingSecondPassword' })(Settings)
