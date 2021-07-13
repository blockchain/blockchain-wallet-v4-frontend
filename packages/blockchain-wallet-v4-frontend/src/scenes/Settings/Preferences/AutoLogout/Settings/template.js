import React from 'react'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import { Field, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { Button, Text } from 'blockchain-info-components'
import { FormGroup, FormItem, NumberBox } from 'components/Form'
import { SettingForm, SettingWrapper } from 'components/Setting'
import { spacing } from 'services/styles'

import { isValidAutoLogoutTime } from './validation'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`
const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 5px;
  & > :first-child {
    margin-right: 5px;
  }
`

const Settings = props => {
  const { handleSubmit, handleToggle, invalid, submitting } = props

  return (
    <SettingWrapper>
      <SettingForm onSubmit={handleSubmit}>
        <FormGroup>
          <Wrapper>
            <FormItem data-e2e='autoLogoutInput'>
              <Field
                name='autoLogoutTime'
                component={NumberBox}
                validate={[isValidAutoLogoutTime]}
              />
            </FormItem>
            <Text size='14px' weight={500} style={spacing('pl-10')}>
              <FormattedMessage
                id='scenes.settings.preferences.autologout.updateform.minutes'
                defaultMessage='Minutes'
              />
            </Text>
          </Wrapper>
          <Text size='12px' color='grey400' weight={400}>
            <FormattedMessage
              id='scenes.preferences.autologout.settings.updateform.bounds'
              defaultMessage='Must be between 1 and 1440 minutes.'
            />
          </Text>
        </FormGroup>
        <ButtonWrapper>
          <Button
            nature='empty'
            capitalize
            onClick={handleToggle}
            data-e2e='cancelAutoLogout'
          >
            <FormattedMessage id='buttons.cancel' defaultMessage='Cancel' />
          </Button>
          <Button
            type='submit'
            nature='primary'
            capitalize
            disabled={submitting || invalid}
            data-e2e='saveAutoLogout'
          >
            <FormattedMessage
              id='scenes.preferences.autologout.settings.updateform.save'
              defaultMessage='Save'
            />
          </Button>
        </ButtonWrapper>
      </SettingForm>
    </SettingWrapper>
  )
}

Settings.propTypes = {
  handleToggle: PropTypes.func.isRequired,
  handleClick: PropTypes.func.isRequired
}

export default reduxForm({ form: 'settingAutoLogoutTime' })(Settings)
