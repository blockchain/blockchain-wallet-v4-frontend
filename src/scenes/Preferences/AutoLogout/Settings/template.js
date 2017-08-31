import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Field } from 'redux-form'

import { Button, ButtonGroup, Text } from 'blockchain-info-components'
import { Form, TextBox } from 'components/Form'

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
  const { updateToggled, handleToggle, handleClick, logoutTime } = props

  if (updateToggled) {
    return (
      <Wrapper>
        <Form>
          <Text size='14px' weight={300} leftAlign>
            <FormattedMessage id='scenes.preferences.email.warning' defaultMessage='Auto Logout Time' />
          </Text>
          <Field name='logoutTime' component={TextBox} />
          <ButtonGroup>
            <Button nature='empty' capitalize onClick={handleToggle}>
              <FormattedMessage id='scenes.preferences.emailAddress.updateform.cancel' defaultMessage='Cancel' />
            </Button>
            <Button nature='secondary' capitalize onClick={handleClick}>
              <FormattedMessage id='scenes.preferences.emailAddress.updateform.save' defaultMessage='Save' />
            </Button>
          </ButtonGroup>
        </Form>
      </Wrapper>
    )
  } else {
    return (
      <Wrapper>
        <Text>32 Minutes</Text>
        <Button nature='secondary' onClick={handleToggle}>
          <FormattedMessage id='scenes.preferences.emailAddress.updateform.change' defaultMessage='Change' />
        </Button>
      </Wrapper>
    )
  }
}

Settings.propTypes = {
  logoutTime: PropTypes.string.isRequired,
  updateToggled: PropTypes.bool.isRequired,
  handleToggle: PropTypes.func.isRequired,
  handleClick: PropTypes.func.isRequired
}

export default Settings
