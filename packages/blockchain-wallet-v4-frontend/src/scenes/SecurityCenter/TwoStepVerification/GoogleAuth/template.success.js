import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Button, Text, Link, Icon } from 'blockchain-info-components'
import styled from 'styled-components'
import QRCodeReact from 'qrcode.react'
import { Field, reduxForm } from 'redux-form'
import { TextBox } from 'components/Form'

import { SecurityDescription, SecurityHeader, SuccessOverlay } from 'components/Security'

const AuthenticatorSummary = styled.div`
  width: 90%;
  padding: 0px 20px;
  opacity: ${props => props.success ? 0.3 : 1};
`
const Header = SecurityHeader.extend`
  justify-content: flex-start;
`
const QRCode = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;
  width: 100%;
  padding: 30px 0;
`
const QRCodeContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`
const QRInputWrapper = styled.div`
  width: 30%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px 0px;
  button {
    margin-top: 10px;
  }
`

const Google = props => {
  const { data } = props
  const { googleSecret } = data
  return (
    <form onSubmit={props.handleSubmit}>
      <SuccessOverlay success={props.ui.successToggled}>
        <Icon name='checkmark-in-circle' size='150px' color='success' />
        <Text size='14px' weight={300} color='success'>
          <FormattedMessage id='scenes.security.twostepverification.description' defaultMessage="Congrats! You've successfully set up Google Authenticator." />
        </Text>
      </SuccessOverlay>
      <AuthenticatorSummary success={props.ui.successToggled}>
        <Header>
          <FormattedMessage id='scenes.security.twostepverification.title' defaultMessage='Two-Step Verification - Authenticator App' />
          <Link size='14px' onClick={props.goBack}>Change</Link>
        </Header>
        <SecurityDescription>
          <Text size='14px' weight={200}>
            <FormattedMessage id='scenes.security.twostepverification.description' defaultMessage='Two-step Verification helps prevent unauthorized access to your wallet by requiring a one-time password after every login attempt. Enabling this option helps keep unauthorized users from being able to access your wallet.' />
          </Text>
        </SecurityDescription>
        <QRCodeContainer>
          {
            googleSecret
              ? <QRCode>
                <QRCodeReact value={googleSecret} size={115} />
              </QRCode>
              : null
          }
          <Text size='14px' weight={200}>
            <FormattedMessage id='scenes.security.twostepverification.description' defaultMessage='1. Scan this QR code with your Authenticator app' />
          </Text>
          <Text size='14px' weight={200}>
            <FormattedMessage id='scenes.security.twostepverification.description' defaultMessage='2. Enter the random number presented below' />
          </Text>
          <QRInputWrapper>
            <Field name='authCode' component={TextBox} placeholder='123AB' />
            <Button nature='primary' onClick={props.handleSubmit}>Verify Code</Button>
          </QRInputWrapper>
        </QRCodeContainer>
      </AuthenticatorSummary>
    </form>
  )
}

Google.propTypes = {
  authType: PropTypes.number.isRequired,
  handleSubmit: PropTypes.func.isRequired
}

export default reduxForm({
  form: 'securityGoogleAuthenticator'
})(Google)
