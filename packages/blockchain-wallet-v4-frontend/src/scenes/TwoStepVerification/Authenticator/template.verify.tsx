import React, { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { Field, InjectedFormProps } from 'redux-form'

import { Button, Text } from 'blockchain-info-components'
import Form from 'components/Form/Form'
import FormError from 'components/Form/FormError'
import FormGroup from 'components/Form/FormGroup'
import FormItem from 'components/Form/FormItem'
import FormLabel from 'components/Form/FormLabel'
import TextBox from 'components/Form/TextBox'
import { required } from 'services/forms'
import { removeWhitespace } from 'services/forms/normalizers'

import { BackArrowFormHeader, CenteredColumn } from '../model'

const AuthenticatorVerify = (props) => {
  const [inputValue, setInputValue] = useState('')
  const [isInputValid, setIsInputValid] = useState(false)

  const handleSubmit = () => {
    props.securityCenterActions.verifyGoogleAuthenticator(props.formValues.newTwoFACode)
  }
  return (
    <>
      <BackArrowFormHeader handleBackArrowClick={() => props.changeAuthenticatorStep(1)} />
      <CenteredColumn>
        <Text size='20px' weight={600} color='grey900' lineHeight='1.5' style={{ margin: '8px 0' }}>
          <FormattedMessage
            id='scenes.login.upgrade.googleAuthVerify.header'
            defaultMessage='Verify Your Google Account'
          />
        </Text>
        <Text
          size='16px'
          weight={500}
          color='grey900'
          lineHeight='1.5'
          style={{ marginBottom: '24px', textAlign: 'center' }}
        >
          <FormattedMessage
            id='scenes.login.upgrade.googleAuthVerify.text'
            defaultMessage='Enter the 6-digit code you see in your Google Auth App.'
          />
        </Text>

        <FormGroup>
          <FormItem>
            <FormLabel htmlFor='authCode' id='authCode'>
              <FormattedMessage
                id='scenes.login.upgrade.googleAuthVerify.6digitcode'
                defaultMessage='6 digit code'
              />
            </FormLabel>
            <Field
              name='newTwoFACode'
              component={TextBox}
              placeholder='Enter 6 digit code'
              normalize={removeWhitespace}
              validate={[required]}
              noLastPass
              autoFocus
              data-e2e='recoverSetUpCode'
            />
          </FormItem>
        </FormGroup>

        <Button
          nature='primary'
          data-e2e='nextButton'
          fullwidth
          height='48px'
          onClick={handleSubmit}
        >
          <FormattedMessage id='buttons.next' defaultMessage='Next' />
        </Button>
      </CenteredColumn>
    </>
  )
}

export default AuthenticatorVerify
