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
  align-items: flex-end;
`
const Settings = (props) => {
  const { toggled, handleToggle, handleClick, emailAddress, submitting, invalid } = props
  const emailRE = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  const validEmailAddress = value => emailRE.test(value) ? undefined : 'Email address invalid'

  if (toggled) {
    return (
      <Wrapper>
        <Text size='14px' weight={300}>
          <FormattedMessage id='scenes.preferences.emailaddress.setting.explain' defaultMessage='Enter your email address below to continue.' />
        </Text>
        <br />
        <Form>
          <Field name='captcha' validate={[validEmailAddress]} component={TextBox} />
          <ButtonGroup>
            <Button nature='empty' onClick={handleToggle} capitalize>
              <FormattedMessage id='scenes.preferences.emailaddress.setting.cancel' defaultMessage='Cancel' />
            </Button>
            <Button nature='secondary' capitalize disabled={submitting || invalid} onClick={handleClick}>
              <FormattedMessage id='scenes.preferences.emailaddress.setting.save' defaultMessage='Save' />
            </Button>
          </ButtonGroup>
        </Form>
      </Wrapper>
    )
  } else {
    return (
      <Wrapper>
        <Text>{emailAddress}</Text>
        <Button nature='secondary' onClick={handleToggle}>
          <FormattedMessage id='scenes.preferences.email.change' defaultMessage='Change' />
        </Button>
      </Wrapper>
    )
  }
}

Settings.propTypes = {
  toggled: PropTypes.bool.isRequired,
  handleToggle: PropTypes.func.isRequired,
  emailAddress: PropTypes.string.isRequired
}

Settings.defaultProps = {
  toggled: false
}

export default Settings
