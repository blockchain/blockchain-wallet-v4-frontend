import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'
import Bowser from 'bowser'
import { find, isEmpty, isNil, path, propEq, propOr } from 'ramda'
import { compose } from 'redux'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
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
import { CoinType, WalletFiatType } from 'blockchain-wallet-v4/src/types'
import { SuccessCartridge } from 'components/Cartridge'
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
import QRCodeWrapper from 'components/QRCodeWrapper'
import { selectors } from 'data'
import { required, validWalletId } from 'services/forms'
import { media } from 'services/styles'

import LinkExchangeAccount from '../Register/LinkExchangeAccount'
import SimpleBuyInfo from '../Register/SimpleBuyInfo'
import { Props as OwnProps } from '.'

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
  ${media.tabletL`
    width: 100%;
    justify-content: center;
  `};
`
const SideWrapper = styled.div`
  height: 442px;
  width: 274px;
  ${media.tabletL`
    display: none;
  `};
`
const CenterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 480px;
  z-index: 1;
  width: 100%;
`

const Footer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  margin-top: 15px;
  ${media.atLeastTablet`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  `}
`
const LoginWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`
const PublicWrapper = styled(Wrapper)`
  position: relative;
  overflow: visible;
  border-radius: ${props => (props.showMobileAuth ? '8px 0 0 8px' : '8px')};
`

const MobileAuthSideWrapper = styled(Wrapper)`
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: visible;
  height: 402px;
  max-width: 274px;
  border-radius: 0 8px 8px 0;
  background-color: ${props => props.theme.grey000};
`
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`
const LoginForm = styled(Form)`
  margin-top: 20px;
`
const LoginButton = styled(Button)`
  margin-top: 15px;
`
const DescriptionText = styled(Text)`
  margin-right: 15px;
`
const DescriptionIcon = styled(Icon)`
  &:before {
    position: absolute;
    margin-top: 1px;
    margin-left: -16px;
  }
`
const LoginTextGroup = styled(TextGroup)`
  line-height: 1;
  margin: 12px 0;
  text-align: center;
`
const LoginHelpText = styled(TextGroup)`
  text-align: center;
`
const GetHelpLink = styled(Link)`
  margin: 0;
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
  &:hover {
    color: ${props => props.theme.white};
    font-weight: 600;
  }
`
const QRCodeContainer = styled.div`
  margin-top: 16px;
  display: flex;
  justify-content: left;
`
const TitleWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

export const CartridgeContainer = styled.div`
  width: auto;
  > span {
    text-transform: uppercase;
  }
`
export const CartridgeSentContainer = styled.div`
  width: auto;
`

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 48px;
`

type GoalDataType = {
  amount: string
  crypto: CoinType
  email?: string
  fiatCurrency: WalletFiatType
}

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
    cacheActions,
    formMeta,
    goals,
    guid,
    invalid,
    isGuidEmailAddress,
    isGuidValid,
    loginError,
    middlewareActions,
    password,
    phonePubKey,
    qrData,
    showMobileAuth,
    submitting,
    supportedCoins,
    ...rest
  } = props
  const { authType, handleSmsResend, handleSubmit } = rest

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
  const simpleBuyGoal = find(propEq('name', 'simpleBuy'), goals)
  const goalData: GoalDataType = propOr({}, 'data', simpleBuyGoal)

  return (
    <OuterWrapper>
      <SideWrapper />
      <CenterWrapper>
        {isLinkAccountGoal && <LinkExchangeAccount />}
        <LoginWrapper>
          {!isNil(goalData) && !isEmpty(goalData) && (
            <HeaderWrapper>
              <Text color='white' size='32px' weight={600}>
                <FormattedMessage
                  defaultMessage='Buy Crypto With Credit Card'
                  id='scenes.login.simplebuy.header'
                />
              </Text>
            </HeaderWrapper>
          )}
          <PublicWrapper showMobileAuth={props.showMobileAuth}>
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
            {!isNil(goalData) &&
              !isEmpty(goalData) &&
              !!goalData.fiatCurrency &&
              !!goalData.crypto &&
              !!goalData.amount && (
                <SimpleBuyInfo
                  goalData={goalData}
                  supportedCoins={supportedCoins}
                />
              )}
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
                {showGuidInvalidError && (
                  <LoginTextGroup inline>
                    <Text size='12px' color='grey800' weight={500}>
                      {isGuidEmailAddress ? (
                        <FormattedMessage
                          id='scenes.login.isguidemailerror'
                          defaultMessage='👋 Hey! Make sure this is your Wallet ID and not an email address. If you need a reminder'
                        />
                      ) : (
                        <FormattedMessage
                          id='scenes.login.isguidinvalid'
                          defaultMessage="👋 Hey! This format doesn't look quite right. Wallet ID's look like this: ef7549a5-94ad-39...If you need a reminder"
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
              {showMobileAuth && (
                <LoginHelpText>
                  <Text size='14px' color='grey600' weight={500}>
                    <FormattedMessage
                      id='scenes.login.needhelpnew'
                      defaultMessage='Need additional help logging in?'
                    />
                  </Text>
                  <LinkContainer to='/help'>
                    <GetHelpLink
                      size='13px'
                      weight={600}
                      data-e2e='loginGetHelp'
                    >
                      <FormattedMessage
                        id='scenes.login.gethelp'
                        defaultMessage='Get Help'
                      />
                    </GetHelpLink>
                  </LinkContainer>
                </LoginHelpText>
              )}
              {isSupportedBrowser && !showMobileAuth && (
                <Footer>
                  <LinkContainer to='/mobile-login'>
                    <Link
                      size='13px'
                      weight={600}
                      data-e2e='loginViaMobileLink'
                    >
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
            </LoginForm>
          </PublicWrapper>
          <LinkContainer data-e2e='signupLink' to='/signup'>
            <Link>
              <SubCard>
                <Text size='16px' color='white' weight={500}>
                  <FormattedMessage
                    id='scenes.login.wallet.link'
                    defaultMessage="Don't have a wallet?"
                  />
                </Text>
                &nbsp;
                <SignUpText size='16px' color='white' weight={600}>
                  <FormattedMessage
                    id='buttons.signup'
                    defaultMessage='Sign Up'
                  />
                </SignUpText>
              </SubCard>
            </Link>
          </LinkContainer>
        </LoginWrapper>
      </CenterWrapper>
      {showMobileAuth && (
        <SideWrapper>
          <MobileAuthSideWrapper>
            {!phonePubKey && (
              <>
                <CartridgeContainer>
                  <SuccessCartridge>
                    <FormattedMessage id='copy.new' defaultMessage='New' />
                  </SuccessCartridge>
                </CartridgeContainer>

                <Text
                  size='16px'
                  color='grey900'
                  weight={600}
                  style={{ marginTop: '8px' }}
                >
                  <FormattedMessage
                    id='scenes.login.qrcodelogin'
                    defaultMessage='QR Code Log In'
                  />
                </Text>
                <TextGroup
                  inline
                  style={{ marginTop: '8px', lineHeight: '18px' }}
                >
                  <DescriptionText size='12px' color='grey900' weight={500}>
                    <FormattedMessage
                      id='scenes.login.qrcodelogin_description_1'
                      defaultMessage='Open your mobile Blockchain App, tap the QR Code Scanner'
                    />
                  </DescriptionText>
                  <DescriptionIcon
                    color='grey900'
                    name='qr-camera'
                    size='16px'
                  />
                  <Text size='12px' color='grey900' weight={500}>
                    <FormattedMessage
                      id='scenes.login.qrcodelogin_description_2'
                      defaultMessage='in the top right & scan this code to log in.'
                    />
                  </Text>
                </TextGroup>

                <QRCodeContainer>
                  {props.secureChannelLoginState.cata({
                    Success: () => {
                      return (
                        <Text size='14px' weight={600}>
                          <FormattedMessage
                            id='scenes.login.qrcodelogin_success'
                            defaultMessage='Success! Logging in...'
                          />
                        </Text>
                      )
                    },
                    Failure: e => (
                      <Text>
                        {typeof e === 'string' ? (
                          e
                        ) : (
                          <FormattedMessage
                            id='scenes.login.qrcodelogin_failed'
                            defaultMessage='Login failed. Please refresh browser and try again.'
                          />
                        )}
                      </Text>
                    ),
                    Loading: () => {
                      return (
                        <Text size='14px' weight={600}>
                          <FormattedMessage
                            id='scenes.login.qrcodelogin_success_confirm'
                            defaultMessage='Please confirm the login on your mobile device.'
                          />
                        </Text>
                      )
                    },
                    NotAsked: () => (
                      <QRCodeWrapper value={qrData} size={175} showImage />
                    )
                  })}
                </QRCodeContainer>
              </>
            )}
            {phonePubKey && (
              <>
                <CartridgeSentContainer>
                  <SuccessCartridge>
                    <FormattedMessage
                      id='scenes.login.wallet.message.sent'
                      defaultMessage='Message Sent'
                    />
                  </SuccessCartridge>
                </CartridgeSentContainer>

                <Text
                  size='16px'
                  color='grey900'
                  weight={600}
                  style={{ marginTop: '8px' }}
                >
                  <FormattedMessage
                    id='scenes.login.wallet.connected.title'
                    defaultMessage='Mobile Device Connected'
                  />
                </Text>

                <Text
                  size='12px'
                  color='grey900'
                  weight={500}
                  style={{ marginTop: '8px' }}
                >
                  <FormattedMessage
                    id='scenes.login.wallet.connected.description_1'
                    defaultMessage='We sent your connected mobile device a notification. Open the app to auto-log in on the web.'
                  />
                </Text>
                <Text
                  size='12px'
                  color='grey900'
                  weight={500}
                  style={{ marginTop: '24px' }}
                >
                  <FormattedMessage
                    id='scenes.login.wallet.connected.description_2'
                    defaultMessage='Didn’t get the notification? Make sure you have push notifications enabled.'
                  />
                </Text>

                <TextGroup
                  inline
                  style={{ marginTop: '8px', lineHeight: '18px' }}
                >
                  <Link
                    size='12px'
                    weight={500}
                    onClick={() => middlewareActions.resendMessageSocket()}
                  >
                    <FormattedMessage
                      id='scenes.login.wallet.connected.send_it_again'
                      defaultMessage='Send Again'
                    />
                  </Link>

                  <Text size='12px' color='grey900' weight={500}>
                    <FormattedMessage id='copy.or' defaultMessage='or' />
                  </Text>

                  <Link
                    size='12px'
                    weight={500}
                    onClick={() => cacheActions.disconnectChannelPhone()}
                  >
                    <FormattedMessage
                      id='scenes.login.wallet.connected.add_a_new_device'
                      defaultMessage='Add a New Device'
                    />
                  </Link>
                </TextGroup>
              </>
            )}
          </MobileAuthSideWrapper>
        </SideWrapper>
      )}
    </OuterWrapper>
  )
}

const mapStateToProps = state => ({
  secureChannelLoginState: selectors.auth.getSecureChannelLogin(state)
})

const connector = connect(mapStateToProps)

const enhance = compose(
  reduxForm<{}, Props>({ form: 'login', destroyOnUnmount: false }),
  connector
)

type Props = OwnProps & {
  busy: boolean
  handleSmsResend: () => void
  loginError?: string
} & ConnectedProps<typeof connector>

export default enhance(Login) as React.FunctionComponent
