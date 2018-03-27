import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Button, Text, Link, Icon } from 'blockchain-info-components'
import styled from 'styled-components'
import { Field, reduxForm } from 'redux-form'
import { TextBox, PhoneNumberBox } from 'components/Form'

import { SecurityDescription, SecurityHeader, SuccessOverlay } from 'components/Security'

const AuthenticatorSummary = styled.div`
  width: 90%;
  padding: 0px 20px;
  opacity: ${props => props.verified ? 0.3 : 1};
`
const Header = SecurityHeader.extend`
  justify-content: flex-start;
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
  margin-top: 20px;
  margin: 20px auto;
  button {
    margin-top: 10px;
  }
  a {
    margin-top: 20px;
  }
`

const SmsAuth = props => {
  const { data, ui, handleSubmit, goBack, handleGetCode, changeMobileNumber, handleVerifyCode } = props
  const { authType, smsVerified, smsNumber } = data

  return (
    <form onSubmit={handleSubmit}>
      <SuccessOverlay verified={smsVerified && authType === 5}>
        <Icon name='checkmark-in-circle' size='150px' color='success' />
        <Text size='14px' weight={300} color='success'>
          <FormattedMessage id='scenes.security.twostepverification.description' defaultMessage="Congrats! You've successfully set up SMS Codes." />
        </Text>
      </SuccessOverlay>
      <AuthenticatorSummary verified={smsVerified && authType === 5}>
        <Header>
          <FormattedMessage id='scenes.security.twostepverification.title' defaultMessage='Two-Step Verification - Mobile Phone Number' />
          <Link size='14px' onClick={goBack}>Change</Link>
        </Header>
        <SecurityDescription>
          <Text size='14px' weight={200}>
            <FormattedMessage id='scenes.security.twostepverification.description' defaultMessage='Two-step Verification helps prevent unauthorized access to your wallet by requiring a one-time password after every login attempt. Enabling this option helps keep unauthorized users from being able to access your wallet.' />
          </Text>
        </SecurityDescription>

        <SmsAuthContainer>
          {
            (!smsNumber && !smsVerified) || ui.changeNumberToggled
              ? <span>
                <Text size='14px' weight={200}>
                  <FormattedMessage id='scenes.security.twostepverification.description' defaultMessage='Enter your mobile number and click Get Code. A verification code will be sent.' />
                </Text>
                <QRInputWrapper>
                  <Field name='mobileNumber' component={PhoneNumberBox} placeholder='212-555-5555' />
                  <Button nature='primary' onClick={handleGetCode}>Get Verification Code</Button>
                </QRInputWrapper>
              </span>
              : <span>
                <Text size='14px' weight={200}>
                  <FormattedMessage id='scenes.security.twostepverification.description' defaultMessage='Enter your verification code below and click submit.' />
                </Text>
                <QRInputWrapper>
                  <Field name='verificationCode' component={TextBox} />
                  <Link weight={200} size='12px' onClick={changeMobileNumber}>Change mobile number</Link>
                  <Button nature='primary' onClick={handleVerifyCode}>Submit Code</Button>
                </QRInputWrapper>
              </span>
          }
        </SmsAuthContainer>
      </AuthenticatorSummary>
    </form>
  )
}

SmsAuth.propTypes = {
  data: PropTypes.shape({
    smsVerified: PropTypes.number,
    authType: PropTypes.number,
    smsNumber: PropTypes.number
  }),
  handleSubmit: PropTypes.func.isRequired,
  goBack: PropTypes.func.isRequired,
  handleGetCode: PropTypes.func.isRequired,
  changeMobileNumber: PropTypes.func.isRequired,
  handleVerifyCode: PropTypes.func.isRequired
}

export default reduxForm({
  form: 'securitySms'
})(SmsAuth)
