import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { Button, Text } from 'blockchain-info-components'
import { NumberBox, FormGroup, FormItem } from 'components/Form'
import { SettingForm, SettingWrapper } from 'components/Setting'
import { spacing } from 'services/StyleService'
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
  const { handleToggle, handleSubmit, submitting, invalid } = props

  return (
    <SettingWrapper>
      <SettingForm onSubmit={handleSubmit}>
        <FormGroup>
          <Wrapper>
            <FormItem>
              <Field
                name='autoLogoutTime'
                component={NumberBox}
                validate={[isValidAutoLogoutTime]}
              />
            </FormItem>
            <Text size='14' weight={300} style={spacing('pl-10')}>
              <FormattedMessage
                id='scenes.settings.preferences.autologout.updateform.minutes'
                defaultMessage='Minutes'
              />
            </Text>
          </Wrapper>
          <Text size='12px' color='gray-3' weight={300}>
            <FormattedMessage
              id='scenes.preferences.autologout.settings.updateform.bounds'
              defaultMessage='Must be between 1 and 1440 minutes.'
            />
          </Text>
        </FormGroup>
        <ButtonWrapper>
          <Button nature='empty' capitalize onClick={handleToggle}>
            <FormattedMessage
              id='scenes.preferences.autologout.settings.updateform.cancel'
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
