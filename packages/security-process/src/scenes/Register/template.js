import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'
import Bowser from 'bowser'
import { find, has, propEq } from 'ramda'

import {
  validPasswordConfirmation,
  required,
  validEmail
} from 'services/FormHelper'
import {
  Banner,
  Button,
  HeartbeatLoader,
  Text
} from 'blockchain-info-components'
import {
  CheckBox,
  Form,
  FormGroup,
  FormItem,
  FormLabel,
  PasswordBox,
  TextBox
} from 'components/Form'
import { Wrapper } from 'components/Public'
import Terms from 'components/Terms'
import LinkAccount from '../LinkAccount'

// load zxcvbn dependency async and set on window
require.ensure(
  ['zxcvbn'],
  require => (window.zxcvbn = require('zxcvbn')),
  'zxcvbn'
)

const browser = Bowser.getParser(window.navigator.userAgent)
const isSupportedBrowser = browser.satisfies({
  chrome: '>45',
  chromium: '>45',
  edge: '>40',
  firefox: '>45',
  opera: '>20',
  safari: '>8',
  vivaldi: '>2'
})

const SignupWrapper = styled.div`
  display: flex;
`
const PublicWrapper = styled(Wrapper)`
  position: relative;
  overflow: visible;
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`
const RegisterForm = styled(Form)`
  margin-top: 20px;
`
const BrowserWarning = styled.div`
  margin-bottom: 10px;
`
const PasswordTip = styled(Text)`
  margin-top: 4px;
`
const validatePasswordConfirmation = validPasswordConfirmation('password')
const checkboxShouldBeChecked = value =>
  value ? undefined : 'You must agree to the terms and conditions'
const validStrongPassword = value =>
  value !== undefined && window.zxcvbn(value).score > 1
    ? undefined
    : () => (
        <FormattedMessage
          id='scenes.register.invalidstrongpassword'
          defaultMessage='Your password is not strong enough'
        />
      )

const Register = props => {
  const { handleSubmit, busy, invalid, password, passwordLength, goals } = props
  let passwordScore = has('zxcvbn', window) ? window.zxcvbn(password).score : 0
  const isLinkAccountGoal = find(propEq('name', 'linkAccount'), goals)

  return (
    <SignupWrapper>
      {isLinkAccountGoal && <LinkAccount />}
      <PublicWrapper>
        <Header>
          <Text
            size='20px'
            color='brand-primary'
            weight={600}
            capitalize
            data-e2e='signupHeader'
          >
            <FormattedMessage
              id='scenes.register.createawallet'
              defaultMessage='Create a Wallet'
            />
          </Text>
        </Header>
        <RegisterForm override onSubmit={handleSubmit}>
          {!isSupportedBrowser && (
            <BrowserWarning>
              <Banner type='warning'>
                <FormattedMessage
                  id='scenes.register.browserwarning'
                  defaultMessage='Your browser is not supported. Please update to at least Chrome 45, Firefox 45, Safari 8, IE 11, or Opera '
                />
              </Banner>
            </BrowserWarning>
          )}
          <FormGroup>
            <FormItem>
              <FormLabel for='email'>
                <FormattedMessage
                  id='scenes.register.email'
                  defaultMessage='Email'
                />
              </FormLabel>
              <Field
                name='email'
                autoFocus
                validate={[required, validEmail]}
                component={TextBox}
                disabled={!isSupportedBrowser}
                data-e2e='signupEmail'
              />
            </FormItem>
          </FormGroup>
          <FormGroup>
            <FormItem>
              <FormLabel for='password'>
                <FormattedMessage
                  id='scenes.register.password'
                  defaultMessage='Password'
                />
              </FormLabel>
              <Field
                name='password'
                validate={[required, validStrongPassword]}
                component={PasswordBox}
                showPasswordScore
                passwordScore={passwordScore}
                disabled={!isSupportedBrowser}
                data-e2e='signupPassword'
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
              <FormLabel for='confirmationPassword'>
                <FormattedMessage
                  id='scenes.register.confirmpassword'
                  defaultMessage='Confirm Password'
                />
              </FormLabel>
              <Field
                name='confirmationPassword'
                validate={[required, validatePasswordConfirmation]}
                component={PasswordBox}
                disabled={!isSupportedBrowser}
                data-e2e='signupConfirmPassword'
              />
            </FormItem>
          </FormGroup>
          <FormGroup>
            <FormItem>
              <Field
                name='terms'
                validate={[checkboxShouldBeChecked]}
                component={CheckBox}
                disabled={!isSupportedBrowser}
                data-e2e='signupTermsCheckbox'
              >
                <Terms />
              </Field>
            </FormItem>
          </FormGroup>
          <FormGroup>
            <Button
              type='submit'
              nature='primary'
              fullwidth
              disabled={busy || invalid}
              height='56px'
              data-e2e='signupButton'
            >
              {busy ? (
                <HeartbeatLoader height='20px' width='20px' color='white' />
              ) : (
                <Text color='white' size='16px' weight={600}>
                  <FormattedMessage
                    id='scenes.register.createmywallet'
                    defaultMessage='Create My Wallet'
                  />
                </Text>
              )}
            </Button>
          </FormGroup>
        </RegisterForm>
      </PublicWrapper>
    </SignupWrapper>
  )
}

export default reduxForm({ form: 'register' })(Register)
