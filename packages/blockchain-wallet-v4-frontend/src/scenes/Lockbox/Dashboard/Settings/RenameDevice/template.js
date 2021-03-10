import React from 'react'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import { Field, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { Button } from 'blockchain-info-components'
import { Form, FormGroup, FormItem, TextBox } from 'components/Form'
import {
  SettingComponent,
  SettingContainer,
  SettingDescription,
  SettingHeader,
  SettingSummary
} from 'components/Setting'
import { required } from 'services/forms'

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin-top: 16px;
  & > :first-child {
    margin-right: 5px;
  }
`

const RenameDevice = props => {
  const {
    deviceName,
    handleCancel,
    handleSubmit,
    handleToggle,
    invalid,
    updateToggled
  } = props

  return (
    <SettingContainer>
      <SettingSummary>
        <SettingHeader>
          <FormattedMessage
            id='scenes.lockbox.settings.renamedevice.title'
            defaultMessage='Name'
          />
        </SettingHeader>
        <SettingDescription>
          <FormattedMessage
            id='scenes.lockbox.settings.renamedevice.description'
            defaultMessage='{deviceName}'
            values={{ deviceName }}
          />
        </SettingDescription>
      </SettingSummary>
      <SettingComponent>
        {!updateToggled && (
          <Button nature='empty' onClick={handleToggle}>
            <FormattedMessage
              id='scenes.lockbox.settings.renamedevice.settings.editname'
              defaultMessage='Rename Device'
            />
          </Button>
        )}
        {updateToggled && (
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <FormItem>
                <Field
                  name='newDeviceName'
                  autoFocus
                  errorBottom
                  validate={[required]}
                  component={TextBox}
                  maxLength={30}
                />
              </FormItem>
            </FormGroup>
            <ButtonWrapper>
              <Button nature='empty' capitalize onClick={handleCancel}>
                <FormattedMessage id='buttons.cancel' defaultMessage='Cancel' />
              </Button>
              <Button
                type='submit'
                nature='primary'
                capitalize
                disabled={invalid}
              >
                <FormattedMessage
                  id='scenes.lockbox.settings.renamedevice.settings.save'
                  defaultMessage='Save'
                />
              </Button>
            </ButtonWrapper>
          </Form>
        )}
      </SettingComponent>
    </SettingContainer>
  )
}

RenameDevice.propTypes = {
  updateToggled: PropTypes.bool.isRequired,
  handleToggle: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired
}

export default reduxForm({
  form: 'RenameDevice'
})(RenameDevice)
