import React from 'react'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import { Field, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { Button, Text } from 'blockchain-info-components'
import { TextBox } from 'components/Form'
import {
  SettingComponent,
  SettingContainer,
  SettingDescription,
  SettingForm,
  SettingHeader,
  SettingSummary,
  SettingWrapper
} from 'components/Setting'
import { validIpList } from 'services/forms'

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 5px;
  & > :first-child {
    margin-right: 5px;
  }
`
const Input = styled(Field)`
  margin-top: 20px;
`
const IPWhitelist = props => {
  const {
    currentWhitelist,
    handleCancel,
    handleSubmit,
    handleToggle,
    invalid,
    submitting,
    updateToggled
  } = props

  return (
    <SettingContainer>
      <SettingSummary>
        <SettingHeader>
          <FormattedMessage
            id='scenes.securitycenter.advanced.ipwhitelist.title'
            defaultMessage='IP Whitelist'
          />
        </SettingHeader>
        <SettingDescription>
          <FormattedMessage
            id='scenes.securitycenter.advanced.ipwhitelist.description'
            defaultMessage="Allow login without email authentication from the following list of IP addresses. Enter IP addresses you'd like to whitelist separated by commas. Use % as a wildcard."
          />
        </SettingDescription>
      </SettingSummary>
      <SettingComponent>
        <SettingWrapper>
          <Text>{currentWhitelist}</Text>
          {!updateToggled && (
            <Button nature='primary' onClick={handleToggle}>
              <FormattedMessage
                id='scenes.securitycenter.advanced.ipwhitelist.edit'
                defaultMessage='Edit'
              />
            </Button>
          )}
          {updateToggled && (
            <SettingForm onSubmit={handleSubmit}>
              <Input
                maxLength={255}
                name='IPWhitelist'
                validate={[validIpList]}
                component={TextBox}
              />
              <ButtonWrapper>
                <Button nature='empty' capitalize onClick={handleCancel}>
                  <FormattedMessage
                    id='buttons.cancel'
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
                    id='scenes.securitycenter.advanced.ipwhitelist.save'
                    defaultMessage='Save'
                  />
                </Button>
              </ButtonWrapper>
            </SettingForm>
          )}
        </SettingWrapper>
      </SettingComponent>
    </SettingContainer>
  )
}

IPWhitelist.propTypes = {
  currentWhitelist: PropTypes.string.isRequired,
  updateToggled: PropTypes.bool.isRequired,
  handleToggle: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired
}

export default reduxForm({ form: 'settingIPWhitelist' })(IPWhitelist)
