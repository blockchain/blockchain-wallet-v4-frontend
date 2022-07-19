import React, { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { Field, InjectedFormProps } from 'redux-form'

import { Button, Text } from 'blockchain-info-components'
import FormError from 'components/Form/FormError'
import FormGroup from 'components/Form/FormGroup'
import FormItem from 'components/Form/FormItem'
import FormLabel from 'components/Form/FormLabel'

const AuthenticatorVerify = (props) => {
  const [inputValue, setInputValue] = useState('')
  const [isInputValid, setIsInputValid] = useState(false)

  const handleSubmit = () => {
    props.securityCenterActions.verifyGoogleAuthenticator(inputValue)
  }
  return (
    <>
      <Text>
        <FormattedMessage
          id='scenes.login.upgrade.googleAuthVerify.header'
          defaultMessage='Verify Your Google Account'
        />
      </Text>
      <Text>
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
            name='6digitcode'
            type='text'
            value={inputValue}
            placeholder='Enter 6 digit code'
          />
        </FormItem>
      </FormGroup>

      <Button
        disabled={!isInputValid}
        nature='primary'
        data-e2e='nextButton'
        fullwidth
        height='48px'
        onClick={handleSubmit}
      >
        <FormattedMessage id='buttons.next' defaultMessage='Next' />
      </Button>
    </>
  )
}

export default AuthenticatorVerify
