import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Button, Text, Link, Icon } from 'blockchain-info-components'
import styled from 'styled-components'
import { Field, reduxForm } from 'redux-form'
import { TextBox, PhoneNumberBox, Form } from 'components/Form'
import { required } from 'services/FormHelper'

import { SuccessOverlay } from 'components/Security'

const AuthenticatorSummary = styled.div`
  width: 110%;
  padding: 0px 20px;
  opacity: ${props => props.verified ? 0.3 : 1};
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
  const { data, ui, onSubmit, changeMobileNumber, invalid, code } = props
  const { smsVerified, smsNumber } = data

  return (
    <Form onSubmit={onSubmit}>
      <SuccessOverlay success={ui.showSuccess}>
        <Icon name='checkmark-in-circle' size='150px' color='success' />
        <Text size='14px' weight={300} color='success'>
          <FormattedMessage id='scenes.security.twostepverification.description' defaultMessage="Congrats! You've successfully set up SMS Codes." />
        </Text>
      </SuccessOverlay>
      <AuthenticatorSummary verified={ui.showSuccess}>
        <SmsAuthContainer>
          {
            (!smsNumber && !smsVerified) || ui.changeNumberToggled
              ? <Fragment>
                <Text size='14px' weight={200}>
                  <FormattedMessage id='scenes.security.twostepverification.description' defaultMessage='Enter your mobile number and click Get Code. A verification code will be sent.' />
                </Text>
                <QRInputWrapper>
                  <Field name='mobileNumber' component={PhoneNumberBox} validate={[required]} placeholder='212-555-5555' />
                  <Button type='submit' nature='primary' disabled={invalid}>Get Verification Code</Button>
                </QRInputWrapper>
              </Fragment>
              : <Fragment>
                <Text size='14px' weight={200}>
                  <FormattedMessage id='scenes.security.twostepverification.description' defaultMessage='Enter your verification code below and click submit.' />
                </Text>
                <QRInputWrapper>
                  <Field name='verificationCode' component={TextBox} validate={[required]} />
                  <Link weight={200} size='12px' onClick={changeMobileNumber}>Change mobile number</Link>
                  <Button type='submit' nature='primary' disabled={!code}>Submit Code</Button>
                </QRInputWrapper>
              </Fragment>
          }
        </SmsAuthContainer>
      </AuthenticatorSummary>
    </Form>
  )
}

SmsAuth.propTypes = {
  data: PropTypes.shape({
    smsVerified: PropTypes.number,
    authType: PropTypes.number,
    smsNumber: PropTypes.number
  }),
  onSubmit: PropTypes.func.isRequired,
  goBack: PropTypes.func.isRequired,
  handleGetCode: PropTypes.func.isRequired,
  changeMobileNumber: PropTypes.func.isRequired
}

export default reduxForm({
  form: 'securitySms'
})(SmsAuth)
