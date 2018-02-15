import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Button, Text, Link, Icon } from 'blockchain-info-components'
import styled from 'styled-components'
import { Field, reduxForm } from 'redux-form'
import { TextBox, PhoneNumberBox } from 'components/Form'

import { SecurityDescription, SecurityHeader } from 'components/Security'

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
const SuccessOverlay = styled.div`
  width: 90%;
  padding: 0px 20px;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  display: ${props => props.verified ? 'flex' : 'none'};
  position: absolute;
  left: 0px;
  z-index: 1;
`

const SmsAuth = props => {
  const { data, ui } = props

  return (
    <form onSubmit={props.handleSubmit}>
      <SuccessOverlay verified={data.smsVerified && data.authType === 5}>
        <Icon name='checkmark-in-circle' size='150px' color='success' />
        <Text size='14px' weight={300} color='success'>
          <FormattedMessage id='scenes.security.twostepverification.description' defaultMessage="Congrats! You've successfully set up SMS Codes." />
        </Text>
      </SuccessOverlay>
      <AuthenticatorSummary verified={data.smsVerified && data.authType === 5}>
        <Header>
          <FormattedMessage id='scenes.security.twostepverification.title' defaultMessage='Two-Step Verification - Mobile Phone Number' />
          <Link size='14px' onClick={props.goBack}>Change</Link>
        </Header>
        <SecurityDescription>
          <Text size='14px' weight={200}>
            <FormattedMessage id='scenes.security.twostepverification.description' defaultMessage='Two-step Verification helps prevent unauthorized access to your wallet by requiring a one-time password after every login attempt. Enabling this option helps keep unauthorized users from being able to access your wallet.' />
          </Text>
        </SecurityDescription>

        <SmsAuthContainer>
          {
            (!data.smsNumber && !data.smsVerified) || ui.changeNumberToggled
              ? <span>
                <Text size='14px' weight={200}>
                  <FormattedMessage id='scenes.security.twostepverification.description' defaultMessage='Enter your mobile number and click Get Code. A verification code will be sent.' />
                </Text>
                <QRInputWrapper>
                  <Field name='mobileNumber' validate={[]} component={PhoneNumberBox} placeholder='212-555-5555' />
                  <Button nature='primary' onClick={props.handleGetCode}>Get Verification Code</Button>
                </QRInputWrapper>
              </span>
              : <span>
                <Text size='14px' weight={200}>
                  <FormattedMessage id='scenes.security.twostepverification.description' defaultMessage='Enter your verification code below and click submit.' />
                </Text>
                <QRInputWrapper>
                  <Field name='verificationCode' validate={[]} component={TextBox} />
                  <Link weight={200} size='12px' onClick={props.changeMobileNumber}>Change mobile number</Link>
                  <Button nature='primary' onClick={props.handleVerifyCode}>Submit Code</Button>
                </QRInputWrapper>
              </span>
          }
        </SmsAuthContainer>
      </AuthenticatorSummary>
    </form>
  )
}

SmsAuth.propTypes = {
  // authType: PropTypes.number.isRequired,
  handleSubmit: PropTypes.func.isRequired
}

export default reduxForm({
  form: 'securitySms'
})(SmsAuth)
