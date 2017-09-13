import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Field } from 'redux-form'

import { Button, ButtonGroup, Text } from 'blockchain-info-components'
import { Form, NumberBox } from 'components/Form'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;

  @media(min-width: 992px) {
    align-items: flex-end;
  }

  & > * { padding: 10px 0; }
`
const Settings = (props) => {
  const { updateToggled, handleToggle, handleClick, logoutTime, submitting, invalid } = props

  const isValidAutoLogoutTime = value => {
    if (!Number.isInteger(Number(value))) return 'Please set a valid time'
    if (value < 1) return 'Please set an auto logout time greater than 1 minute.'
    if (value > 1440) return 'Please set an auto logout time less than 1440'
    return undefined
  }

  if (updateToggled) {
    return (
      <Wrapper>
        <Form>
          <Text size='14px' weight={300} leftAlign>
            <FormattedMessage id='scenes.preferences.autologout.settings.warning' defaultMessage='Auto Logout Time' />
          </Text>
          <Field name='autoLogoutTime' component={NumberBox} validate={[isValidAutoLogoutTime]} />
          <ButtonGroup>
            <Button nature='empty' capitalize onClick={handleToggle}>
              <FormattedMessage id='scenes.preferences.autologout.settings.updateform.cancel' defaultMessage='Cancel' />
            </Button>
            <Button nature='secondary' capitalize disabled={submitting || invalid} onClick={handleClick}>
              <FormattedMessage id='scenes.preferences.autologout.settings.updateform.save' defaultMessage='Save' />
            </Button>
          </ButtonGroup>
        </Form>
      </Wrapper>
    )
  } else {
    return (
      <Wrapper>
        <Text>
          <FormattedMessage id='scenes.preferences.autologout.settings.minutes' defaultMessage='{time} minutes' values={{ time: logoutTime }} />
        </Text>
        <Button nature='secondary' onClick={handleToggle}>
          <FormattedMessage id='scenes.preferences.autologout.settings.updateform.change' defaultMessage='Change' />
        </Button>
      </Wrapper>
    )
  }
}

Settings.propTypes = {
  logoutTime: PropTypes.number.isRequired,
  updateToggled: PropTypes.bool.isRequired,
  handleToggle: PropTypes.func.isRequired,
  handleClick: PropTypes.func.isRequired
}

export default Settings
