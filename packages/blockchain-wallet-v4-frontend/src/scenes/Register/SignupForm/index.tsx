import { Banner, Text } from 'blockchain-info-components'
import { Field } from 'redux-form'
import { FormattedMessage } from 'react-intl'
import { has } from 'ramda'
import {
  required,
  validEmail,
  validPasswordConfirmation
} from 'services/FormHelper'

import Bowser from 'bowser'
import React from 'react'
import styled from 'styled-components'

import {
  Form,
  FormGroup,
  FormItem,
  FormLabel,
  PasswordBox,
  TextBox
} from 'components/Form'
import Terms from 'components/Terms'

// load zxcvbn dependency async and set on window
// @ts-ignore
require.ensure(
  ['zxcvbn'],
  // @ts-ignore
  require => (window.zxcvbn = require('zxcvbn')),
  'zxcvbn'
)

const browser = Bowser.getParser(window.navigator.userAgent)
const isSupportedBrowser = browser.satisfies({
  chrome: '>45',
  chromium: '>45',
  edge: '>16',
  firefox: '>45',
  opera: '>20',
  safari: '>8',
  vivaldi: '>2'
})

const RegisterForm = styled(Form)`
  margin-top: 20px;
  max-height: 26rem;

  > div * {
    max-height: 26rem;
    opacity: 1;
    z-index: 1;
    transition: all 0.5s ease;
  }
`
const BrowserWarning = styled.div`
  margin-bottom: 10px;
`
const PasswordTip = styled(Text)`
  margin-top: 4px;
`

const validatePasswordConfirmation = validPasswordConfirmation('password')
const validStrongPassword = value =>
  // @ts-ignore
  value !== undefined && window.zxcvbn(value).score > 1
    ? undefined
    : () => (
        <FormattedMessage
          id='scenes.register.invalidstrongpassword'
          defaultMessage='Your password is not strong enough'
        />
      )

const SignupForm = ({ handleSubmit, password, passwordLength }) => {
  // @ts-ignore
  let passwordScore = has('zxcvbn', window) ? window.zxcvbn(password).score : 0
  return (
    <RegisterForm override onSubmit={handleSubmit}>
      {!isSupportedBrowser && (
        <BrowserWarning>
          <Banner type='warning'>
            <FormattedMessage
              defaultMessage='Your browser is not supported. Please update to at least Chrome 45, Firefox 45, Safari 8, IE 11, or Opera '
              id='scenes.register.browserwarning'
            />
          </Banner>
        </BrowserWarning>
      )}
      <FormGroup>
        <FormItem>
          <FormLabel htmlFor='email'>
            <FormattedMessage
              id='scenes.register.youremail'
              defaultMessage='Your Email'
            />
          </FormLabel>
          <Field
            autoFocus
            bgColor='grey000'
            component={TextBox}
            data-e2e='signupEmail'
            disabled={!isSupportedBrowser}
            name='email'
            validate={[required, validEmail]}
          />
        </FormItem>
      </FormGroup>
      <FormGroup>
        <FormItem>
          <FormLabel htmlFor='password'>
            <FormattedMessage
              defaultMessage='Password'
              id='scenes.register.password'
            />
          </FormLabel>
          <Field
            bgColor='grey000'
            component={PasswordBox}
            data-e2e='signupPassword'
            disabled={!isSupportedBrowser}
            name='password'
            passwordScore={passwordScore}
            showPasswordScore
            validate={[required, validStrongPassword]}
          />
        </FormItem>
        {passwordLength > 0 && (
          <div>
            <PasswordTip size='12px' weight={400}>
              {passwordScore <= 1 && (
                <FormattedMessage
                  id='formhelper.passwordsuggest.weak'
                  defaultMessage='Weak. Use at least 8 characters, a mix of letters, numbers and symbols.'
                />
              )}
              {passwordScore >= 2 && passwordScore < 4 && (
                <FormattedMessage
                  id='formhelper.passwordsuggest.medium'
                  defaultMessage='Medium. Use at least 8 characters, a mix of letters, numbers and symbols.'
                />
              )}
              {passwordScore === 4 && (
                <FormattedMessage
                  id='formhelper.passwordsuggest.great'
                  defaultMessage='Great password.'
                />
              )}
            </PasswordTip>
          </div>
        )}
      </FormGroup>
      <FormGroup>
        <FormItem>
          <FormLabel htmlFor='confirmationPassword'>
            <FormattedMessage
              defaultMessage='Confirm Password'
              id='scenes.register.confirmpassword'
            />
          </FormLabel>
          <Field
            bgColor='grey000'
            component={PasswordBox}
            data-e2e='signupConfirmPassword'
            disabled={!isSupportedBrowser}
            name='confirmationPassword'
            validate={[required, validatePasswordConfirmation]}
          />
        </FormItem>
      </FormGroup>
      <FormGroup>
        <FormItem>
          <Terms style={{ width: '397px' }} />
        </FormItem>
      </FormGroup>
    </RegisterForm>
  )
}
export default SignupForm
