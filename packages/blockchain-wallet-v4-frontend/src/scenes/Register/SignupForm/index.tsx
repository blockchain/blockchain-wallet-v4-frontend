import React from 'react'
import { FormattedMessage } from 'react-intl'
import Bowser from 'bowser'
import { Field } from 'redux-form'
import styled from 'styled-components'

import {
  Banner,
  Button,
  HeartbeatLoader,
  Link,
  Text,
  TextGroup
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
import Terms from 'components/Terms'
import {
  required,
  validEmail,
  validPasswordConfirmation,
  validStrongPassword
} from 'services/forms'

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

  > div * {
    max-height: 26rem;
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

const FieldWrapper = styled.div`
  margin-top: 0.25rem;
  margin-right: 0 !important;
`

const validatePasswordConfirmation = validPasswordConfirmation('password')

const scrollToId = id => {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

const scrollToPassword = () => scrollToId('password')

const scrollToSecondPassword = () => scrollToId('confirmationPassword')

const SignupForm = ({
  busy,
  handleSubmit,
  invalid,
  password,
  passwordLength
}) => {
  let passwordScore = window.zxcvbn ? window.zxcvbn(password).score : 0
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
          <FormLabel htmlFor='password' id='password'>
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
            onFocus={scrollToPassword}
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
          <FormLabel htmlFor='confirmationPassword' id='confirmationPassword'>
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
            onFocus={scrollToSecondPassword}
            validate={[required, validatePasswordConfirmation]}
          />
        </FormItem>
      </FormGroup>
      <FormGroup inline>
        <FieldWrapper>
          <Field
            name='secretPhase'
            validate={[required]}
            component={CheckBox}
            hideErrors
          />
        </FieldWrapper>
        <FormLabel>
          <TextGroup inline>
            <Text color='grey800' size='12px' weight={500}>
              <FormattedMessage
                id='scenes.register.backupphrase1'
                defaultMessage='I understand that Blockchain.com never stores passwords and therefore cannot recover or reset my password. If I lose access to my wallet, I must use my'
              />
            </Text>
            <Link
              href='https://support.blockchain.com/hc/en-us/articles/209564506-Make-a-Wallet-Backup'
              target='_blank'
              size='12px'
              weight={500}
              data-e2e='blockchainTermsLink'
            >
              <FormattedMessage
                id='scenes.securitysettings.basicsecurity.secretrecoveryphrase.title'
                defaultMessage='Secret Private Key Recovery Phrase'
              />
            </Link>
            <Text color='grey800' size='12px' weight={500}>
              <FormattedMessage
                id='scenes.register.backupphrase2'
                defaultMessage='to access my funds.'
              />
            </Text>
          </TextGroup>
        </FormLabel>
      </FormGroup>
      <FormGroup>
        <FormItem>
          <Terms style={{ width: '397px' }} />
        </FormItem>
      </FormGroup>

      <Button
        data-e2e='signupButton'
        disabled={busy || invalid}
        fullwidth
        height='48px'
        nature='primary'
        style={{
          borderRadius: '8px'
        }}
        type='submit'
      >
        {busy ? (
          <HeartbeatLoader height='20px' width='20px' color='white' />
        ) : (
          <Text color='whiteFade900' size='16px' weight={600}>
            <FormattedMessage
              id='scenes.public.register.createWallet'
              defaultMessage='Create Wallet'
            />
          </Text>
        )}
      </Button>
    </RegisterForm>
  )
}

export default SignupForm
