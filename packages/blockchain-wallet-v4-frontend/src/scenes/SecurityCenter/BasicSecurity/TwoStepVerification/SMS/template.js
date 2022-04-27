/* stylelint-disable */

import React from 'react'
import { FormattedMessage } from 'react-intl'
import { isValidNumber } from 'libphonenumber-js'
import PropTypes from 'prop-types'
import { Field, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { Button, Link, Text } from 'blockchain-info-components'
import Form from 'components/Form/Form'
import PhoneNumberBox from 'components/Form/PhoneNumberBox'
import TextBox from 'components/Form/TextBox'
import { required } from 'services/forms'
import { media } from 'services/styles'

const validMobileNumber = (value) =>
  isValidNumber(value) ? undefined : (
    <FormattedMessage id='formhelper.invalidmobilenumber' defaultMessage='Invalid mobile number' />
  )

const AuthenticatorSummary = styled.div`
  width: 100%;
  padding: 0 20px;
  ${media.mobile`
    padding: 0;
  `};
  opacity: ${(props) => (props.verified ? 0.3 : 1)};
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
  ${media.mobile`
    width: 55%;
  `};
`
const StyledText = styled(Text)`
  ${media.mobile`
    padding-left: 20px;
  `};
`

const SmsAuth = (props) => {
  const { changeMobileNumber, code, data, handleSubmit, invalid, uiState } = props
  const { countryCode, smsNumber, smsVerified } = data

  return (
    <Form onSubmit={handleSubmit}>
      <AuthenticatorSummary verified={uiState.successToggled}>
        <SmsAuthContainer>
          {(!smsNumber && !smsVerified) || uiState.changeNumberToggled ? (
            <>
              <StyledText size='14px' weight={400}>
                <FormattedMessage
                  id='scenes.security.twostepverification.sms.entermobile'
                  defaultMessage='Enter your mobile number and click Get Code. A verification code will be sent.'
                />
              </StyledText>
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
            </>
          ) : (
            <>
              <Text size='14px' weight={400}>
                <FormattedMessage
                  id='scenes.security.twostepverification.sms.entercode'
                  defaultMessage='Enter your verification code below and click submit.'
                />
              </Text>
              <QRInputWrapper>
                <Field name='verificationCode' component={TextBox} validate={[required]} />
                <Link weight={500} size='12px' onClick={changeMobileNumber}>
                  Change mobile number
                </Link>
                <Button type='submit' nature='primary' disabled={!code}>
                  Submit Code
                </Button>
              </QRInputWrapper>
            </>
          )}
        </SmsAuthContainer>
      </AuthenticatorSummary>
    </Form>
  )
}

SmsAuth.propTypes = {
  changeMobileNumber: PropTypes.func.isRequired,
  data: PropTypes.shape({
    authType: PropTypes.number,
    smsNumber: PropTypes.string,
    smsVerified: PropTypes.number
  })
}

export default reduxForm({
  form: 'securitySms'
})(SmsAuth)
