import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Field } from 'redux-form'

import { validMobileNumber, required } from 'services/FormHelper'
import { Button, ButtonGroup, Text, TextGroup } from 'blockchain-info-components'
import { Form, PhoneNumberBox, TextBox } from 'components/Form'

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
const Setting = (props) => {
  const { updateToggled, verifyToggled, handleToggle, handleClick, handleResend, handleVerify, smsNumber, submitting, invalid } = props

  return (
    <Wrapper>
      <Text>{smsNumber}</Text>
      <Button nature='secondary' onClick={handleToggle}>
        <FormattedMessage id='scenes.preferences.mobilenumber.updateform.change' defaultMessage='Change' />
      </Button>
      { updateToggled &&
        <Form>
          <TextGroup inline>
            <Text size='14px' weight={300}>
              <FormattedMessage id='scenes.preferences.mobilenumber.updateform.explain' defaultMessage='Use your mobile phone to receive a one-time-password after a login attempt.' />
            </Text>
            <Text size='14px' weight={300}>
              <FormattedMessage id='scenes.preferences.mobilenumber.updateform.explain2' defaultMessage='Add your mobile phone number below to continue' />
            </Text>
          </TextGroup>
          <Field name='mobileNumber' validate={[validMobileNumber]} component={PhoneNumberBox} />
          <ButtonGroup>
            <Button nature='empty' capitalize onClick={handleToggle}>
              <FormattedMessage id='scenes.preferences.mobilenumber.updateform.cancel' defaultMessage='Cancel' />
            </Button>
            <Button nature='secondary' capitalize disabled={submitting || invalid} onClick={handleClick}>
              <FormattedMessage id='scenes.preferences.mobilenumber.updateform.save' defaultMessage='Save' />
            </Button>
          </ButtonGroup>
        </Form>
      }
      { !updateToggled && verifyToggled &&
        <Form>
          <TextGroup inline>
            <Text size='14px' weight={300}>
              <FormattedMessage id='scenes.preferences.mobilenumber.verifyform.explain' defaultMessage='We have sent your mobile phone an SMS message with a verification code.' />
            </Text>
            <Text size='14px' weight={300}>
              <FormattedMessage id='scenes.preferences.mobilenumber.verifyform.explain2' defaultMessage='Enter the code below to verify your mobile phone number' />
            </Text>
          </TextGroup>
          <Field name='code' validate={[required]} component={TextBox} />
          <ButtonGroup>
            <Button nature='empty' onClick={handleResend} capitalize>
              <FormattedMessage id='scenes.preferences.mobilenumber.verifyform.resend' defaultMessage='Resend' />
            </Button>
            <Button nature='secondary' capitalize disabled={submitting || invalid} onClick={handleVerify}>
              <FormattedMessage id='scenes.preferences.mobilenumber.verifyform.verify' defaultMessage='Verify' />
            </Button>
          </ButtonGroup>
        </Form>
      }
    </Wrapper>
  )
}

Setting.propTypes = {
  smsNumber: PropTypes.string.isRequired,
  updateToggled: PropTypes.bool.isRequired,
  verifyToggled: PropTypes.bool.isRequired,
  handleToggle: PropTypes.func.isRequired,
  handleClick: PropTypes.func.isRequired,
  handleResend: PropTypes.func.isRequired,
  handleVerify: PropTypes.func.isRequired
}

export default Setting
