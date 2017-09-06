import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Field } from 'redux-form'

import { Button, ButtonGroup, Text } from 'blockchain-info-components'
import { Form, PasswordBox } from 'components/Form'

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
  const { updateToggled, handleToggle, handleClick, submitting, invalid, secondPasswordEnabled } = props
  if (secondPasswordEnabled) {
    return (
      <Wrapper>
        <Button nature='secondary' onClick={handleToggle}>
          <FormattedMessage id='scenes.security.secondPassword.updateform.removesecondpassword' defaultMessage='Remove Second Password' />
        </Button>
        {updateToggled &&
          <Form>
            <Text size='14px' weight={300}>
              <FormattedMessage id='scenes.security.secondPassword.updateform.label' defaultMessage='Second Password' />
            </Text>
            <Field name='secondPassword' component={PasswordBox} />
            <ButtonGroup>
              <Button nature='empty' capitalize onClick={handleToggle}>
                <FormattedMessage id='scenes.security.secondPassword.updateform.cancel' defaultMessage='Cancel' />
              </Button>
              <Button nature='secondary' capitalize disabled={submitting || invalid} onClick={handleClick}>
                <FormattedMessage id='scenes.security.secondPassword.updateform.save' defaultMessage='Save' />
              </Button>
            </ButtonGroup>
          </Form>
        }
      </Wrapper>
    )
  } else {
    return (
      <Wrapper>
        <Button nature='secondary' onClick={handleToggle}>
          <FormattedMessage id='scenes.security.secondPassword.updateform.setsecondpassword' defaultMessage='Set Second Password' />
        </Button>
        {updateToggled &&
          <Form initialValues={{secondPassword: '', secondPasswordConfirmation: ''}}>
            <Text size='14px' weight={300} color='error'>
              <FormattedMessage id='scenes.security.secondPassword.warning' defaultMessage="We highly recommend you backup your wallet's recovery phrase before setting a second password. Backing up your wallet will ensure your bitcoins are safe in case you lose your password. For your security, we do not keep any passwords on file." />
            </Text>
            <Text size='14px' weight={300}>
              <FormattedMessage id='scenes.security.secondPassword.label' defaultMessage='Second Password' />
            </Text>
            <Field name='secondPassword' component={PasswordBox} />
            <Text size='14px' weight={300}>
              <FormattedMessage id='scenes.security.secondPasswordConfirmation.label' defaultMessage='Confirm Second Password' />
            </Text>
            <Field name='secondPasswordConfirmation' validate={(value, allValues) => (value === allValues['secondPassword']) ? undefined : 'Passwords do not match'} component={PasswordBox} />
            <ButtonGroup>
              <Button nature='empty' capitalize onClick={handleToggle}>
                <FormattedMessage id='scenes.security.secondPassword.updateform.cancel' defaultMessage='Cancel' />
              </Button>
              <Button nature='secondary' capitalize disabled={submitting || invalid} onClick={handleClick}>
                <FormattedMessage id='scenes.security.secondPassword.updateform.save' />
              </Button>
            </ButtonGroup>
          </Form>
        }
      </Wrapper>
    )
  }
}

Settings.propTypes = {
  updateToggled: PropTypes.bool.isRequired,
  handleToggle: PropTypes.func.isRequired,
  handleClick: PropTypes.func.isRequired
}

export default Settings
