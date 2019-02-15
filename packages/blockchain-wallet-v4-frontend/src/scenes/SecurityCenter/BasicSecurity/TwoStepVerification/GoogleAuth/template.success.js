import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Button, Text } from 'blockchain-info-components'
import styled from 'styled-components'
import QRCodeWrapper from 'components/QRCodeWrapper'
import { Field, reduxForm } from 'redux-form'
import { TextBox } from 'components/Form'
import { required } from 'services/FormHelper'
import { spacing } from 'services/StyleService'

const AuthenticatorSummary = styled.div`
  width: 100%;
  padding: 0 20px;
  opacity: ${props => (props.success ? 0.3 : 1)};
  @media (min-width: 992px) {
    width: 110%;
  }
`
const QRCode = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;
  width: 100%;
  padding: 30px 0;
`
const QRCodeCopy = styled.div`
  display: block;
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
  margin: 20px 0;
  button {
    margin-top: 10px;
  }
`

const Google = props => {
  const { data, invalid, handleSubmit, uiState } = props

  return (
    <form onSubmit={handleSubmit}>
      <AuthenticatorSummary success={uiState.successToggled}>
        <QRCodeContainer>
          {data.googleSecret ? (
            <QRCode>
              <QRCodeWrapper value={data.googleSecret} size={115} />
            </QRCode>
          ) : null}
          <QRCodeCopy>
            <Text size='14px' weight={200}>
              <FormattedMessage
                id='scenes.security.twostepverification.authenticator.stepone'
                defaultMessage='1. Scan this QR code with your Authenticator app.'
              />
            </Text>
            <Text size='14px' weight={200} style={spacing('mt-5')}>
              <FormattedMessage
                id='scenes.security.twostepverification.authenticator.steptwo'
                defaultMessage='2. Enter the random number presented below.'
              />
            </Text>
          </QRCodeCopy>
          <QRInputWrapper>
            <Field
              name='authCode'
              component={TextBox}
              validate={[required]}
              placeholder='111 222'
            />
            <Button type='submit' nature='primary' disabled={invalid}>
              Verify Code
            </Button>
          </QRInputWrapper>
        </QRCodeContainer>
      </AuthenticatorSummary>
    </form>
  )
}

Google.propTypes = {
  handleSubmit: PropTypes.func.isRequired
}

export default reduxForm({
  form: 'securityGoogleAuthenticator'
})(Google)
