import React from 'react'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import { Field, reduxForm } from 'redux-form'
import styled from 'styled-components'
import { any, equals} from 'ramda'

import { Button } from 'blockchain-info-components'
import { required } from 'services/FormHelper'
import { SettingForm, SettingWrapper } from 'components/Setting'
import { Form, FormGroup, FormItem, TextBox } from 'components/Form'
import {
  SettingComponent,
  SettingContainer,
  SettingDescription,
  SettingHeader,
  SettingSummary
} from 'components/Setting'

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
    deviceIndex,
    updateToggled,
    handleToggle,
    handleSubmit,
    submitting,
    invalid,
    handleCancel
  } = props

  // let requireUnique = (value, allValues) => {
  //   return any(equals(value))(['stop'])
  //     ? 'Device name is already taken.'
  //     : undefined
  // }

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
              id='scenes.lockbox.settings.renamedevice.settings.edit'
              defaultMessage='edit'
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
                  validate={[required]}
                  component={TextBox}
                  maxLength={30}
                />
              </FormItem>
            </FormGroup>
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

export default reduxForm({ form: 'RenameDevice' })(RenameDevice)
