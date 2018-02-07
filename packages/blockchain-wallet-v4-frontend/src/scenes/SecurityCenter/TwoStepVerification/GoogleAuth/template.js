import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Button, Text, Link } from 'blockchain-info-components'
import styled from 'styled-components'
import QRCodeReact from 'qrcode.react'
import { Field, reduxForm } from 'redux-form'
import { TextBox } from 'components/Form'
import { validEmailCode } from 'services/FormHelper'

import { SecurityComponent, SecurityContainer, SecurityDescription, SecurityHeader, SecuritySummary } from 'components/Security'

const AuthenticatorSummary = styled.div`
  width: 90%;
  padding: 0px 20px;
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

const Google = props => {
  console.log('template.js', props)
  const { data } = props
  const { googleSecret } = data
  return (
    <form onSubmit={props.handleSubmit}>
      <AuthenticatorSummary>
        <Header>
          <FormattedMessage id='scenes.security.twostepverification.title' defaultMessage='Two-Step Verification - Authenticator App' />
          <Link size='14px'>Change</Link>
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
          <Field name='authCode' validate={[validEmailCode]} component={TextBox} placeholder='123AB' />
        </QRCodeContainer>
      </AuthenticatorSummary>
    </form>
  )
}

// Google.propTypes = {
//   authType: PropTypes.number.isRequired,
//   handleClick: PropTypes.func.isRequired
// }

// export default Google
export default reduxForm({
  form: 'securityGoogleAuthenticator'
})(Google)
