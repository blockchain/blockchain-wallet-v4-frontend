import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { Button, ButtonGroup, Text } from 'blockchain-info-components'
import { TextBox } from 'components/Form'
import { validIpList } from 'services/FormHelper'
import { SettingForm, SettingWrapper } from 'components/Setting'

const ButtonWrapper = styled(ButtonGroup)`
  margin-top: 5px;
  & > :first-child {
    margin-right: 5px;
  }
`
const Input = styled(Field)`
  margin-top: 20px;
`
const Settings = (props) => {
  const { updateToggled, handleToggle, handleSubmit, currentWhitelist, submitting, invalid, handleCancel } = props

  return (
    <SettingWrapper>
      <Text>{currentWhitelist.data}</Text>
      { !updateToggled &&
        <Button nature='primary' onClick={handleToggle}>
          <FormattedMessage id='scenes.securitysettings.advancedsettings.ipwhitelist.settings.change' defaultMessage='Add' />
        </Button>
      }
      { updateToggled &&
        <SettingForm onSubmit={handleSubmit}>
          <Input name='IPWhitelist' validate={[validIpList]} component={TextBox} />
          <ButtonWrapper>
            <Button nature='empty' capitalize onClick={handleCancel}>
              <FormattedMessage id='scenes.securitysettings.advancedsettings.ipwhitelist.settings.cancel' defaultMessage='Cancel' />
            </Button>
            <Button type='submit' nature='primary' capitalize disabled={submitting || invalid}>
              <FormattedMessage id='scenes.securitysettings.advancedsettings.ipwhitelist.settings.save' defaultMessage='Save' />
            </Button>
          </ButtonWrapper>
        </SettingForm>
      }
    </SettingWrapper>
  )
}

Settings.propTypes = {
  currentWhitelist: PropTypes.string.isRequired,
  updateToggled: PropTypes.bool.isRequired,
  handleToggle: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired
}

export default reduxForm({ form: 'settingIPWhitelist' })(Settings)
