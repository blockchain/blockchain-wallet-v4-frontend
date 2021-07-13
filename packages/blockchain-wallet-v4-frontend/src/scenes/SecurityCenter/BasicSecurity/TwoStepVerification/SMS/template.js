/* stylelint-disable */

import React, { Fragment } from 'react'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import { Field, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { Button, Link, Text } from 'blockchain-info-components'
import { Form, PhoneNumberBox, TextBox } from 'components/Form'
import { required, validMobileNumber } from 'services/forms'

const AuthenticatorSummary = styled.div`
  width: 100%;
  padding: 0px 20px;
  opacity: ${props => (props.verified ? 0.3 : 1)};
  @media (min-width: 992px) {
    width: 110%;
  }
`
const SmsAuthContainer = styled.div`
  margin-top: 25px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`
const QRInputWrapper = styled.div`
  width: 45%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px auto;
  button {
    margin-top: 10px;
  }
  a {
    margin-top: 20px;
  }
`

const SmsAuth = props => {
  const {
    changeMobileNumber,
    code,
    data,
    handleSubmit,
    invalid,
    uiState
  } = props
  const { countryCode, smsNumber, smsVerified } = data

  return (
    <Form onSubmit={handleSubmit}>
      <AuthenticatorSummary verified={uiState.successToggled}>
        <SmsAuthContainer>
          {(!smsNumber && !smsVerified) || uiState.changeNumberToggled ? (
            <Fragment>
              <Text size='14px' weight={400}>
                <FormattedMessage
                  id='scenes.security.twostepverification.sms.entermobile'
                  defaultMessage='Enter your mobile number and click Get Code. A verification code will be sent.'
                />
              </Text>
              <QRInputWrapper>
                <Field
                  name='mobileNumber'
                  component={PhoneNumberBox}
                  validate={[required, validMobileNumber]}
                  countryCode={countryCode}
                  defaultValue={smsNumber}
                  placeholder='212-555-5555'
                />
                <Button type='submit' nature='primary' disabled={invalid}>
                  Get Verification Code
                </Button>
              </QRInputWrapper>
            </Fragment>
          ) : (
            <Fragment>
              <Text size='14px' weight={400}>
                <FormattedMessage
                  id='scenes.security.twostepverification.sms.entercode'
                  defaultMessage='Enter your verification code below and click submit.'
                />
              </Text>
              <QRInputWrapper>
                <Field
                  name='verificationCode'
                  component={TextBox}
                  validate={[required]}
                />
                <Link weight={500} size='12px' onClick={changeMobileNumber}>
                  Change mobile number
                </Link>
                <Button type='submit' nature='primary' disabled={!code}>
                  Submit Code
                </Button>
              </QRInputWrapper>
            </Fragment>
          )}
        </SmsAuthContainer>
      </AuthenticatorSummary>
    </Form>
  )
}

SmsAuth.propTypes = {
  data: PropTypes.shape({
    smsVerified: PropTypes.number,
    authType: PropTypes.number,
    smsNumber: PropTypes.string
  }),
  onSubmit: PropTypes.func.isRequired,
  changeMobileNumber: PropTypes.func.isRequired
}

export default reduxForm({
  form: 'securitySms'
})(SmsAuth)
