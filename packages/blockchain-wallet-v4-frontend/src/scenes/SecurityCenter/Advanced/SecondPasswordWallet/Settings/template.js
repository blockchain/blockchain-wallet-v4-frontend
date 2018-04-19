import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { Button, ButtonGroup, Text, TextGroup } from 'blockchain-info-components'
import { PasswordBox } from 'components/Form'
import { SettingForm, SettingWrapper } from 'components/Setting'

const SecondPasswordWrapper = styled(SettingWrapper)`
  width: ${props => props.toggled ? '150%' : 'initial'};
`

const Settings = (props) => {
  const { updateToggled, handleToggle, handleClick, submitting, invalid, secondPasswordEnabled } = props
  if (secondPasswordEnabled) {
    return (
      <SettingWrapper>
        <Button nature='primary' onClick={handleToggle}>
          <FormattedMessage id='scenes.securitysettings.basicsecurity.secondpasswordwallet.settings.remove' defaultMessage='Remove Second Password' />
        </Button>
        {updateToggled &&
          <SettingForm>
            <Text size='14px' weight={300}>
              <FormattedMessage id='scenes.securitysettings.basicsecurity.secondpasswordwallet.settings.label' defaultMessage='Second Password' />
            </Text>
            <Field name='secondPassword' component={PasswordBox} />
            <ButtonGroup>
              <Button nature='empty' capitalize onClick={handleToggle}>
                <FormattedMessage id='scenes.securitysettings.basicsecurity.secondpasswordwallet.settings.cancel' defaultMessage='Cancel' />
              </Button>
              <Button nature='primary' capitalize disabled={submitting || invalid} onClick={handleClick}>
                <FormattedMessage id='scenes.securitysettings.basicsecurity.secondpasswordwallet.settings.save' defaultMessage='Save' />
              </Button>
            </ButtonGroup>
          </SettingForm>
        }
      </SettingWrapper>
    )
  } else {
    return (
      <SecondPasswordWrapper toggled={updateToggled}>
        <Button nature='primary' onClick={handleToggle}>
          <FormattedMessage id='scenes.securitysettings.basicsecurity.secondpasswordwallet.settings.set' defaultMessage='Set Second Password' />
        </Button>
        {updateToggled &&
          <SettingForm>
            <TextGroup inline>
              <Text size='14px' weight={300} color='error'>
                <FormattedMessage id='scenes.securitysettings.basicsecurity.secondpasswordwallet.settings.warning' defaultMessage="We highly recommend you backup your wallet's recovery phrase before setting a second password." />
              </Text>
              <Text size='14px' weight={300} color='error'>
                <FormattedMessage id='scenes.securitysettings.basicsecurity.secondpasswordwallet.settings.warning2' defaultMessage='Backing up your wallet will ensure your funds are safe in case you lose your password.' />
              </Text>
              <Text size='14px' weight={300} color='error'>
                <FormattedMessage id='scenes.securitysettings.basicsecurity.secondpasswordwallet.settings.warning3' defaultMessage='For your security, we do not keep any passwords on file.' />
              </Text>
            </TextGroup>
            <Text size='14px' weight={300}>
              <FormattedMessage id='scenes.securitysettings.basicsecurity.secondpasswordwallet.settings.label2' defaultMessage='Second Password' />
            </Text>
            <Field name='secondPassword' component={PasswordBox} />
            <Text size='14px' weight={300}>
              <FormattedMessage id='scenes.securitysettings.basicsecurity.secondpasswordwallet.settings.explain' defaultMessage='Confirm Second Password' />
            </Text>
            <Field name='secondPasswordConfirmation' validate={(value, allValues) => (value === allValues['secondPassword']) ? undefined : 'Passwords do not match'} component={PasswordBox} />
            <ButtonGroup>
              <Button nature='empty' capitalize onClick={handleToggle}>
                <FormattedMessage id='scenes.securitysettings.basicsecurity.secondpasswordwallet.settings.cancel2' defaultMessage='Cancel' />
              </Button>
              <Button nature='primary' capitalize disabled={submitting || invalid} onClick={handleClick}>
                <FormattedMessage id='scenes.securitysettings.basicsecurity.secondpasswordwallet.settings.save2' defaultMessage='Save' />
              </Button>
            </ButtonGroup>
          </SettingForm>
        }
      </SecondPasswordWrapper>
    )
  }
}

Settings.propTypes = {
  updateToggled: PropTypes.bool.isRequired,
  handleToggle: PropTypes.func.isRequired,
  handleClick: PropTypes.func.isRequired
}

export default reduxForm({ form: 'settingSecondPassword' })(Settings)
