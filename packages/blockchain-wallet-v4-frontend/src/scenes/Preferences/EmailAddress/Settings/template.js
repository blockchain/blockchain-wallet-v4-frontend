import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Field } from 'redux-form'

import { Button, ButtonGroup, Text } from 'blockchain-info-components'
import { TextBox } from 'components/Form'
import { SettingForm } from 'components/Setting'
import { validEmail } from 'services/FormHelper'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;

  @media(min-width: 992px) { align-items: flex-end; }

  & > * { margin-bottom: 10px; }
`

const Settings = (props) => {
  const { updateToggled, verifyToggled, handleToggle, handleClick, handleResend, email, submitting, invalid } = props

  return (
    <Wrapper>
      <Text>{email}</Text>
      <Button nature='secondary' onClick={handleToggle}>
        <FormattedMessage id='scenes.preferences.emailAddress.updateform.change' defaultMessage='Change' />
      </Button>
      {updateToggled &&
        <SettingForm>
          <Text size='14px' weight={300} color='error'>
            <FormattedMessage id='scenes.preferences.email.warning' defaultMessage="This will change your wallet's email address, but the email address you signed up to Buy Bitcoin with will remain the same." />
          </Text>
          <Field name='emailAddress' validate={[validEmail]} component={TextBox} />
          <ButtonGroup>
            <Button nature='empty' capitalize onClick={handleToggle}>
              <FormattedMessage id='scenes.preferences.emailAddress.updateform.cancel' defaultMessage='Cancel' />
            </Button>
            <Button nature='secondary' capitalize disabled={submitting || invalid} onClick={handleClick}>
              <FormattedMessage id='scenes.preferences.emailAddress.updateform.save' defaultMessage='Save' />
            </Button>
          </ButtonGroup>
        </SettingForm>
      }
      {!updateToggled && verifyToggled &&
        <SettingForm>
          <Text size='14px' weight={300}>
            <FormattedMessage id='scenes.preferences.emailAddress.verifyform.explain' defaultMessage='We have sent you an email with a link to verify your email address.' />
          </Text>
          <ButtonGroup>
            <Button nature='empty' capitalize onClick={handleToggle}>
              <FormattedMessage id='scenes.preferences.emailAddress.verifyform.cancel' defaultMessage='Cancel' />
            </Button>
            <Button nature='secondary' onClick={handleResend} capitalize>
              <FormattedMessage id='scenes.preferences.emailAddress.verifyform.resend' defaultMessage='Resend' />
            </Button>
          </ButtonGroup>
        </SettingForm>
      }
    </Wrapper>
  )
}

Settings.propTypes = {
  email: PropTypes.string.isRequired,
  updateToggled: PropTypes.bool.isRequired,
  verifyToggled: PropTypes.bool.isRequired,
  handleToggle: PropTypes.func.isRequired,
  handleClick: PropTypes.func.isRequired,
  handleResend: PropTypes.func.isRequired
}

export default Settings
