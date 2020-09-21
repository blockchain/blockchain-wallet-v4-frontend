import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import { find, path, propEq } from 'ramda'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import Bowser from 'bowser'
import React from 'react'
import styled from 'styled-components'

import {
  Banner,
  Button,
  HeartbeatLoader,
  Icon,
  Image,
  Link,
  Text,
  TextGroup
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
import { required, validWalletId } from 'services/FormHelper'
import { Wrapper } from 'components/Public'

import { Props as OwnProps } from '.'
import LinkExchangeAccount from '../Register/LinkExchangeAccount'
import Modals from '../../modals'

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

export const removeWhitespace = string => string.replace(/\s/g, ``)

const OuterWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 1028px;
`
const SideWrapper = styled.div`
  width: 274px;
  padding: 12px 0 12px 0;
  display: flex;
  flex-direction: column;
`
const CenterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 480px;
`
const LoginWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`
const PublicWrapper = styled(Wrapper)`
  position: relative;
  overflow: visible;
`

const PublicSideWrapper = styled(Wrapper)`
  position: relative;
  overflow: visible;
  max-width: 274px;
  border-radius: 0 8px 8px 0;
`
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
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
const SubCard = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1.25rem;
`
const SignUpText = styled(Text)`
  display: flex;
  flex-direction: row;
  line-height: 24px;
`
const SignUpTextWithHover = styled(SignUpText)`
  &:hover {
    text-decoration: underline;
  }
`

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;

  span {
    font-weight: 600;
    font-size: 1.5rem;
    line-height: 135%;
  }

  img {
    background-color: ${p => p.theme['marketing-primary']};
    border-radius: 1.75rem;
    padding: 0.5rem;
    margin-right: 20px;
  }
`

const LinkAccountTitle = () => (
  <TitleWrapper>
    <Image name='wallet' height='2rem' />
    <FormattedMessage
      id='scenes.linkaccount.authorize2'
      defaultMessage='Connect Your Wallet'
    />
  </TitleWrapper>
)

const Login = (props: InjectedFormProps<{}, Props> & Props) => {
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
    <OuterWrapper>
      <SideWrapper />
      <CenterWrapper>
        {isLinkAccountGoal && <LinkExchangeAccount />}
        <LoginWrapper>
          <PublicWrapper>
            <Modals />
            <Header>
              <Text size='20px' color='textBlack' weight={600} capitalize>
                {isLinkAccountGoal ? (
                  <LinkAccountTitle />
                ) : (
                  <FormattedMessage
                    id='scenes.login.welcome'
                    defaultMessage='Welcome back!'
                  />
                )}
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
                  <FormLabel htmlFor='guid'>
                    <FormattedMessage
                      id='scenes.login.guid'
                      defaultMessage='Wallet ID'
                    />
                  </FormLabel>
                  <Field
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
                    <Text size='12px' color='grey800' weight={500}>
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
                    <Text size='12px' color='grey800' weight={500}>
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
                  <FormLabel htmlFor='password'>
                    <FormattedMessage
                      id='scenes.login.password'
                      defaultMessage='Password'
                    />
                  </FormLabel>
                  <Field
                    name='password'
                    validate={[required]}
                    component={PasswordBox}
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
                    <FormLabel htmlFor='code'>
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
                  height='48px'
                  disabled={submitting || invalid || busy || !password}
                  data-e2e='loginButton'
                >
                  {busy && !loginError ? (
                    <HeartbeatLoader height='20px' width='20px' color='white' />
                  ) : (
                    <Text color='whiteFade900' size='16px' weight={600}>
                      <FormattedMessage
                        id='scenes.login.login'
                        defaultMessage='Log In'
                      />
                    </Text>
                  )}
                </LoginButton>
              </FormGroup>
            </LoginForm>
          </PublicWrapper>

          <LinkContainer data-e2e='signupLink' to='/signup'>
            <Link>
              <SubCard>
                <SignUpText size='16px' color='white' weight={500}>
                  <FormattedMessage
                    id='scenes.login.wallet.link'
                    defaultMessage="Don't have a wallet?"
                  />
                </SignUpText>
                &nbsp;
                <SignUpTextWithHover size='16px' color='white' weight={600}>
                  <FormattedMessage
                    id='scenes.login.wallet.signup'
                    defaultMessage='Sign up Now'
                  />
                </SignUpTextWithHover>
                <Icon size='24px' color='white' name='arrow-right' />
              </SubCard>
            </Link>
          </LinkContainer>
        </LoginWrapper>
      </CenterWrapper>
      <SideWrapper>
        <PublicSideWrapper>bbb</PublicSideWrapper>
      </SideWrapper>
    </OuterWrapper>
  )
}

type Props = OwnProps & {
  busy: boolean
  handleSmsResend: () => void
  loginError?: string
}

export default reduxForm<{}, Props>({ form: 'login', destroyOnUnmount: false })(
  Login
)
