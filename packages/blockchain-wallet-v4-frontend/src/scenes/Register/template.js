import {
  Banner,
  Button,
  HeartbeatLoader,
  Text
} from 'blockchain-info-components'
import { Field, reduxForm } from 'redux-form'
import { find, has, propEq } from 'ramda'
import {
  Form,
  FormGroup,
  FormItem,
  FormLabel,
  PasswordBox,
  TextBox
} from 'components/Form'
import { FormattedMessage } from 'react-intl'
import {
  required,
  validEmail,
  validPasswordConfirmation
} from 'services/FormHelper'
import { Wrapper } from 'components/Public'
import Bowser from 'bowser'
import LinkExchangeAccount from './LinkExchangeAccount'
import React from 'react'
import styled from 'styled-components'
import Terms from 'components/Terms'

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
  edge: '>16',
  firefox: '>45',
  opera: '>20',
  safari: '>8',
  vivaldi: '>2'
})

const SignupWrapper = styled.div`
  display: flex;
  position: relative;
`
const PublicWrapper = styled(Wrapper)`
  position: relative;
  overflow: visible;
  z-index: 1;
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
const validStrongPassword = value =>
  value !== undefined && window.zxcvbn(value).score > 1
    ? undefined
    : () => (
        <FormattedMessage
          id='scenes.register.invalidstrongpassword'
          defaultMessage='Your password is not strong enough'
        />
      )

const Register = ({
  busy,
  goals,
  handleSubmit,
  invalid,
  password,
  passwordLength
}) => {
  let passwordScore = has('zxcvbn', window) ? window.zxcvbn(password).score : 0
  const isLinkAccountGoal = find(propEq('name', 'linkAccount'), goals)

  return (
    <SignupWrapper>
      {isLinkAccountGoal && <LinkExchangeAccount />}
      <PublicWrapper>
        <Header>
          <Text
            size='20px'
            color='grey800'
            weight={600}
            data-e2e='signupHeader'
          >
            <FormattedMessage
              id='scenes.register.createaccount'
              defaultMessage='Create an Account'
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
              <FormLabel htmlFor='email'>
                <FormattedMessage
                  id='scenes.register.youremail'
                  defaultMessage='Your Email'
                />
              </FormLabel>
              <Field
                name='email'
                autoFocus
                bgColor='grey000'
                borderNone
                validate={[required, validEmail]}
                component={TextBox}
                disabled={!isSupportedBrowser}
                data-e2e='signupEmail'
              />
            </FormItem>
          </FormGroup>
          <FormGroup>
            <FormItem>
              <FormLabel htmlFor='password'>
                <FormattedMessage
                  id='scenes.register.password'
                  defaultMessage='Password'
                />
              </FormLabel>
              <Field
                bgColor='grey000'
                borderNone
                component={PasswordBox}
                disabled={!isSupportedBrowser}
                data-e2e='signupPassword'
                name='password'
                validate={[required, validStrongPassword]}
                noLastPass
                showPasswordScore
                passwordScore={passwordScore}
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
                  id='scenes.register.confirmpassword'
                  defaultMessage='Confirm Password'
                />
              </FormLabel>
              <Field
                bgColor='grey000'
                borderNone
                name='confirmationPassword'
                validate={[required, validatePasswordConfirmation]}
                component={PasswordBox}
                noLastPass
                disabled={!isSupportedBrowser}
                data-e2e='signupConfirmPassword'
              />
            </FormItem>
          </FormGroup>
          <FormGroup>
            <FormItem>
              <Terms style={{ width: '397px' }} />
            </FormItem>
          </FormGroup>
          <FormGroup>
            <Button
              type='submit'
              nature='primary'
              fullwidth
              disabled={busy || invalid}
              height='48px'
              data-e2e='signupButton'
            >
              {busy ? (
                <HeartbeatLoader height='20px' width='20px' color='white' />
              ) : (
                <Text color='white' size='16px' weight={600}>
                  <FormattedMessage
                    id='scenes.register.continue'
                    defaultMessage='Continue'
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
