import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { Button, ButtonGroup } from 'blockchain-info-components'
import { TextBox } from 'components/Form'
import { required } from 'services/FormHelper'
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
const Settings = props => {
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
      {!updateToggled && (
        <Button nature='primary' onClick={handleToggle}>
          <FormattedMessage
            id='scenes.lockbox.settings.renamedevice.settings.edit'
            defaultMessage='Edit'
          />
        </Button>
      )}
      {updateToggled && (
        <SettingForm onSubmit={handleSubmit}>
          <Input name='DeviceName' validate={[required]} component={TextBox} />
          <ButtonWrapper>
            <Button nature='empty' capitalize onClick={handleCancel}>
              <FormattedMessage
                id='scenes.lockbox.settings.renamedevice.settings.cancel'
                defaultMessage='Cancel'
              />
            </Button>
            <Button
              type='submit'
              nature='primary'
              capitalize
              disabled={submitting || invalid}
            >
              <FormattedMessage
                id='scenes.lockbox.settings.renamedevice.settings.save'
                defaultMessage='Save'
              />
            </Button>
          </ButtonWrapper>
        </SettingForm>
      )}
    </SettingWrapper>
  )
}

Settings.propTypes = {
  updateToggled: PropTypes.bool.isRequired,
  handleToggle: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired
}

export default reduxForm({ form: 'RenameDevice' })(Settings)
