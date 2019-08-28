import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Field, reduxForm } from 'redux-form'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import LinkAccount from '../LinkAccount'
import { find, path, propEq } from 'ramda'
import Bowser from 'bowser'

import Modals from 'modals'
import { required, validWalletId } from 'services/FormHelper'
import {
  Banner,
  Button,
  Link,
  Text,
  TextGroup,
  HeartbeatLoader
} from 'blockchain-info-components'
import {
  Form,
  FormError,
  FormGroup,
  FormItem,
  FormLabel,
  PasswordBox,
  TextBox
} from 'components/Form'
import { Wrapper } from 'components/Public'

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

export const removeWhitespace = string => string.replace(/\s/g, ``)

const LoginWrapper = styled.div`
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
const Footer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  margin-top: 15px;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`
const LoginForm = styled(Form)`
  margin: 20px 0;
`
const LoginButton = styled(Button)`
  margin-top: 15px;
`
const LoginTextGroup = styled(TextGroup)`
  line-height: 1;
  margin: 12px 0;
  text-align: center;
`
const GuidError = styled(TextGroup)`
  display: inline;
  margin-top: 3px;
`
const ResendSmsLink = styled(Link)`
  margin-top: 4px;
`
const BrowserWarning = styled.div`
  margin-bottom: 10px;
`

const Login = props => {
  const {
    busy,
    formMeta,
    goals,
    guid,
    invalid,
    isGuidEmailAddress,
    isGuidValid,
    loginError,
    password,
    submitting,
    ...rest
  } = props
  const { handleSubmit, handleSmsResend, authType } = rest

  const guidError =
    loginError && loginError.toLowerCase().includes('unknown wallet id')
  const passwordError =
    loginError && loginError.toLowerCase().includes('wrong_wallet_password')
  const twoFactorError =
    loginError && loginError.toLowerCase().includes('authentication code')
  const accountLocked =
    loginError &&
    (loginError.toLowerCase().includes('this account has been locked') ||
      loginError.toLowerCase().includes('account is locked'))

  const isGuidTouched = path(['guid', 'touched'], formMeta)
  const showGuidInvalidError = guid && !isGuidValid && isGuidTouched
  const isLinkAccountGoal = find(propEq('name', 'linkAccount'), goals)

  return (
    <LoginWrapper>
      {isLinkAccountGoal && <LinkAccount />}
      <PublicWrapper>
        <Modals />
        <Header>
          <Text size='20px' color='brand-primary' weight={600} capitalize>
            <FormattedMessage
              id='scenes.login.welcome'
              defaultMessage='Welcome back!'
            />
          </Text>
        </Header>
        <LoginForm onSubmit={handleSubmit}>
          {!isSupportedBrowser && (
            <BrowserWarning>
              <Banner type='warning'>
                <FormattedMessage
                  id='scenes.login.browserwarning'
                  defaultMessage='Your browser is not supported. Please update to at least Chrome 45, Firefox 45, Safari 8, Edge, or Opera.'
                />
              </Banner>
            </BrowserWarning>
          )}
          <FormGroup>
            <FormItem>
              <FormLabel for='guid'>
                <FormattedMessage
                  id='scenes.login.guid'
                  defaultMessage='Wallet ID'
                />
              </FormLabel>
              <Field
                borderColor={guidError ? 'invalid' : undefined}
                component={TextBox}
                data-e2e='loginGuid'
                disabled={!isSupportedBrowser}
                disableSpellcheck
                name='guid'
                normalize={removeWhitespace}
                validate={[required, validWalletId]}
              />
            </FormItem>
            {guidError && (
              <GuidError inline>
                <Text
                  size='12px'
                  color='error'
                  weight={400}
                  data-e2e='walletIdError'
                >
                  <FormattedMessage
                    id='scenes.login.guiderror'
                    defaultMessage='Unknown Wallet ID. If you need a reminder '
                  />
                </Text>
                <LinkContainer to='/reminder'>
                  <Link size='12px' weight={500}>
                    <FormattedMessage
                      id='scenes.login.clickhere'
                      defaultMessage='click here.'
                    />
                  </Link>
                </LinkContainer>
              </GuidError>
            )}
            {showGuidInvalidError ? (
              <LoginTextGroup inline>
                <Text size='12px' color='gray-6' weight={500}>
                  {isGuidEmailAddress ? (
                    <FormattedMessage
                      id='scenes.login.isguidemailerror'
                      defaultMessage='👋Hey! Make sure this is your Wallet ID and not an email address. If you need a reminder'
                    />
                  ) : (
                    <FormattedMessage
                      id='scenes.login.isguidinvalid'
                      defaultMessage="👋Hey! This format doesn't look quite right. Wallet ID's look like this: ef7549a5-94ad-39...If you need a reminder"
                    />
                  )}
                </Text>
                <LinkContainer to='/reminder'>
                  <Link size='12px' weight={600}>
                    <FormattedMessage
                      id='scenes.login.clickhere'
                      defaultMessage='click here.'
                    />
                  </Link>
                </LinkContainer>
              </LoginTextGroup>
            ) : (
              <LoginTextGroup inline>
                <Text size='12px' color='gray-6' weight={500}>
                  <FormattedMessage
                    id='scenes.login.findyourguid'
                    defaultMessage='Your Wallet ID can be found at the bottom of any email we’ve ever sent you. Need a reminder?'
                  />
                </Text>
                <LinkContainer to='/reminder'>
                  <Link size='12px' weight={500}>
                    <FormattedMessage
                      id='scenes.login.sendguid'
                      defaultMessage='Send my Wallet ID'
                    />
                  </Link>
                </LinkContainer>
              </LoginTextGroup>
            )}
          </FormGroup>
          <FormGroup>
            <FormItem>
              <FormLabel for='password'>
                <FormattedMessage
                  id='scenes.login.password'
                  defaultMessage='Password'
                />
              </FormLabel>
              <Field
                name='password'
                validate={[required]}
                component={PasswordBox}
                borderColor={passwordError ? 'invalid' : undefined}
                disabled={!isSupportedBrowser}
                data-e2e='loginPassword'
              />
              {passwordError && (
                <FormError
                  position={authType > 0 ? 'relative' : 'absolute'}
                  data-e2e='passwordError'
                >
                  <FormattedMessage
                    id='scenes.login.wrong_password'
                    defaultMessage='Error decrypting wallet. Wrong password'
                  />
                </FormError>
              )}
              {accountLocked && (
                <FormError
                  position={
                    authType > 0 || passwordError ? 'relative' : 'absolute'
                  }
                >
                  {loginError}
                </FormError>
              )}
            </FormItem>
          </FormGroup>
          {authType > 0 && (
            <FormGroup>
              <FormItem>
                <FormLabel for='code'>
                  {authType === 1 && (
                    <FormattedMessage
                      id='scenes.login.yubikey'
                      defaultMessage='Yubikey'
                    />
                  )}
                  {authType === 4 && (
                    <FormattedMessage
                      id='scenes.login.google'
                      defaultMessage='Authenticator App Code'
                    />
                  )}
                  {authType === 5 && (
                    <FormattedMessage
                      id='scenes.login.mobile'
                      defaultMessage='SMS Code'
                    />
                  )}
                </FormLabel>
                <Field
                  name='code'
                  normalize={removeWhitespace}
                  validate={[required]}
                  component={authType === 1 ? PasswordBox : TextBox}
                  noLastPass
                  autoFocus
                  borderColor={twoFactorError ? 'invalid' : undefined}
                  data-e2e='loginTwoFactorCode'
                />
                {authType === 5 && (
                  <ResendSmsLink
                    size='12px'
                    weight={400}
                    onClick={handleSmsResend}
                  >
                    <FormattedMessage
                      id='scenes.login.resendsms'
                      defaultMessage='Resend SMS'
                    />
                  </ResendSmsLink>
                )}
                {twoFactorError && (
                  <FormError position={'absolute'}>{loginError}</FormError>
                )}
              </FormItem>
            </FormGroup>
          )}
          <FormGroup>
            <LoginButton
              type='submit'
              nature='primary'
              fullwidth
              height='56px'
              disabled={submitting || invalid || busy || !password}
              data-e2e='loginButton'
            >
              {busy && !loginError ? (
                <HeartbeatLoader height='20px' width='20px' color='white' />
              ) : (
                <Text color='white' size='16px' weight={600}>
                  <FormattedMessage
                    id='scenes.login.login'
                    defaultMessage='Log In'
                  />
                </Text>
              )}
            </LoginButton>
          </FormGroup>
        </LoginForm>
        {isSupportedBrowser && (
          <Footer>
            <LinkContainer to='/mobile-login'>
              <Link size='13px' weight={600} data-e2e='loginViaMobileLink'>
                <FormattedMessage
                  id='scenes.login.loginmobile'
                  defaultMessage='Login via Mobile'
                />
              </Link>
            </LinkContainer>
            <LinkContainer to='/help'>
              <Link size='13px' weight={600} data-e2e='loginGetHelp'>
                <FormattedMessage
                  id='scenes.login.needhelp'
                  defaultMessage='Need some help?'
                />
              </Link>
            </LinkContainer>
          </Footer>
        )}
      </PublicWrapper>
    </LoginWrapper>
  )
}

Login.propTypes = {
  handleSmsResend: PropTypes.func.isRequired
}

export default reduxForm({ form: 'login', destroyOnUnmount: false })(Login)
