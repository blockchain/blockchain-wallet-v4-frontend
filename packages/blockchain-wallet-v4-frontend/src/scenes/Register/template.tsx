import {
  Banner,
  Button,
  HeartbeatLoader,
  Icon,
  Link,
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
import { LinkContainer } from 'react-router-bootstrap'

import {
  required,
  validEmail,
  validPasswordConfirmation
} from 'services/FormHelper'
// import { Wrapper } from 'components/Public'
import Bowser from 'bowser'
import Header from './Header'
import LinkExchangeAccount from './LinkExchangeAccount'
import media from 'services/ResponsiveService'
import React from 'react'
import styled from 'styled-components'
import Terms from 'components/Terms'

import { PropsType as _P } from '.'

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
  flex-direction: column;
  align-items: center;
`

const CardsWrapper = styled.div`
  display: flex;

  ${media.tabletL`
    flex-direction: column;
    justify-content: center;
  `}

  ${media.tablet`
    width: 100%;
  `}
`

const CardWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 29rem;

  &:first-child {
    margin-right: 2.5rem;
  }

  ${media.tabletL`
    &:first-child {
      margin-right: 0;
    }
  `}

  ${media.tablet`
    width: 100%;
  `}
`

const Card = styled.div`
  padding: 2rem;
  background: white;
  border-radius: 0.75rem;
  box-sizing: border-box;

  ${media.tablet`
    width: 100%;
    margin: 0 2rem;
  `}
`

const CardHeader = styled.div`
  align-items: center;
  display: flex;
`

const IconWrapper = styled.div`
  display: flex;
  background: ${props => props.theme[props.color]};
  height: 3.5rem;
  width: 3.5rem;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  margin-right: 1.25rem;
`

// const PublicWrapper = styled(Wrapper)`
//   position: relative;
//   overflow: visible;
//   z-index: 1;
// `

const RegisterForm = styled(Form)`
  margin-top: 20px;
`
const BrowserWarning = styled.div`
  margin-bottom: 10px;
`
const PasswordTip = styled(Text)`
  margin-top: 4px;
`

const CardInfo = styled.div`
  display: flex;
  flex-direction: column;
`

const InfoTitle = styled(Text)`
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
`

const InfoItem = styled.div`
  display: flex;
  margin-bottom: 0.5rem;
`

const SubCard = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 0.5rem;
`

const ExchangeButton = styled(Button)`
  color: ${props => props.theme.white};
  background-color: ${props => props.theme.black};
  position: relative;
  border: none;

  &:hover {
    background-color: ${props => props.theme.grey900};
  }
`

const TabIcon = styled(Icon)`
  position: absolute;
  right: 1rem;
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

type StateType = {
  showForm: boolean
}

type PropsType = {
  busy: boolean
  onSubmit: () => void
  password: string
  passwordLength: number
} & _P

class Register extends React.Component<PropsType, StateType> {
  state = {
    showForm: false
  }

  toggleForm = () => {
    this.setState({ showForm: true })
  }

  render () {
    const {
      busy,
      goals,
      handleSubmit,
      invalid,
      password,
      passwordLength
    } = this.props

    let passwordScore = has('zxcvbn', window)
      ? window.zxcvbn(password).score
      : 0
    const isLinkAccountGoal = find(propEq('name', 'linkAccount'), goals)
    const buttonSubmit = this.state.showForm ? handleSubmit : this.toggleForm

    return (
      <SignupWrapper>
        {isLinkAccountGoal && <LinkExchangeAccount />}
        <Header />

        <CardsWrapper>
          <CardWrapper>
            <Card>
              <CardHeader>
                <IconWrapper color='blue600'>
                  <Icon color='white' name='wallet-filled' size='32px' />
                </IconWrapper>
                <Text size='24px' color='black' weight={600}>
                  <FormattedMessage
                    id='scenes.register.walletcard.title'
                    defaultMessage='Blockchain Wallet'
                  />
                </Text>
              </CardHeader>

              <CardInfo>
                <InfoTitle color='grey800' size='18px' weight={600}>
                  <FormattedMessage
                    id='scenes.register.walletcard.infotitle'
                    defaultMessage='Be your own bank'
                  />
                </InfoTitle>

                <InfoItem>
                  <Text color='grey800' size='16px' weight={600}>
                    <FormattedMessage
                      id='scenes.register.walletcard.item.1.bold'
                      defaultMessage='Easily buy and sell'
                    />
                  </Text>
                  &nbsp;
                  <Text color='grey600' size='16px' weight={500}>
                    <FormattedMessage
                      id='scenes.register.walletcard.item.1.regular'
                      defaultMessage='Bitcoin, Ether, and more.'
                    />
                  </Text>
                </InfoItem>

                <InfoItem>
                  <Text color='grey800' size='16px' weight={600}>
                    <FormattedMessage
                      id='scenes.register.walletcard.item.2.bold'
                      defaultMessage='Securely store your'
                    />
                  </Text>
                  &nbsp;
                  <Text color='grey600' size='16px' weight={500}>
                    <FormattedMessage
                      id='scenes.register.walletcard.item.2.regular'
                      defaultMessage='on mobile or desktop.'
                    />
                  </Text>
                </InfoItem>

                <InfoItem>
                  <Text color='grey800' size='16px' weight={600}>
                    <FormattedMessage
                      id='scenes.register.walletcard.item.3.bold'
                      defaultMessage='Control your money'
                    />
                  </Text>
                  &nbsp;
                  <Text color='grey600' size='16px' weight={500}>
                    <FormattedMessage
                      id='scenes.register.walletcard.item.3.regular'
                      defaultMessage='by holding your private keys.'
                    />
                  </Text>
                </InfoItem>
              </CardInfo>
              {this.state.showForm && (
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
                        component={PasswordBox}
                        disabled={!isSupportedBrowser}
                        data-e2e='signupPassword'
                        name='password'
                        validate={[required, validStrongPassword]}
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
                        <HeartbeatLoader
                          height='20px'
                          width='20px'
                          color='white'
                        />
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
              )}
              <Button
                disabled={
                  this.state.showForm ? busy || invalid : this.state.showForm
                }
                fullwidth
                height='48px'
                nature='primary'
                onClick={buttonSubmit}
                style={{
                  marginTop: '1rem',
                  borderRadius: '8px'
                }}
              >
                <FormattedMessage
                  id='scenes.public.register.createWallet'
                  defaultMessage='Create Wallet'
                />
              </Button>
            </Card>

            <LinkContainer to='/login'>
              <Link>
                <SubCard>
                  <Text size='14px' color='whiteFade600' weight={500}>
                    <FormattedMessage
                      id='scenes.register.wallet.link'
                      defaultMessage='Already have a wallet?'
                    />
                  </Text>
                  &nbsp;
                  <Text size='14px' color='white' weight={500}>
                    <FormattedMessage
                      id='scenes.register.wallet.signin'
                      defaultMessage='Sign In'
                    />
                  </Text>
                </SubCard>
              </Link>
            </LinkContainer>
          </CardWrapper>

          <CardWrapper>
            <Card>
              <CardHeader>
                <IconWrapper color='black'>
                  <Icon color='white' name='blockchain-logo' size='32px' />
                </IconWrapper>
                <Text size='24px' color='black' weight={600}>
                  <FormattedMessage
                    id='scenes.register.exchangecard.title'
                    defaultMessage='Blockchain Exchange'
                  />
                </Text>
              </CardHeader>

              <CardInfo>
                <InfoTitle color='grey800' size='18px' weight={600}>
                  <FormattedMessage
                    id='scenes.register.exchangecard.infotitle'
                    defaultMessage='The world’s most trusted crypto exchange.'
                  />
                </InfoTitle>

                <InfoItem>
                  <Text color='grey800' size='16px' weight={600}>
                    <FormattedMessage
                      id='scenes.register.exchangecard.item.1.bold'
                      defaultMessage='Lightning-fast trades'
                    />
                  </Text>
                  &nbsp;
                  <Text color='grey600' size='16px' weight={500}>
                    <FormattedMessage
                      id='scenes.register.exchangecard.item.1.regular'
                      defaultMessage='mean you get the best price.'
                    />
                  </Text>
                </InfoItem>

                <InfoItem>
                  <Text color='grey800' size='16px' weight={600}>
                    <FormattedMessage
                      id='scenes.register.exchangecard.item.2.bold'
                      defaultMessage='Over 20 trading pairs'
                    />
                  </Text>
                  &nbsp;
                  <Text color='grey600' size='16px' weight={500}>
                    <FormattedMessage
                      id='scenes.register.exchangecard.item.2.regular'
                      defaultMessage='Including USD, GBP, and EUR.'
                    />
                  </Text>
                </InfoItem>

                <InfoItem>
                  <Text color='grey800' size='16px' weight={600}>
                    <FormattedMessage
                      id='scenes.register.exchangecard.item.3.bold'
                      defaultMessage='Control your money'
                    />
                  </Text>
                  &nbsp;
                  <Text color='grey600' size='16px' weight={500}>
                    <FormattedMessage
                      id='scenes.register.exchangecard.item.3.regular'
                      defaultMessage='by connecting your Wallet.'
                    />
                  </Text>
                </InfoItem>
              </CardInfo>
              <Link
                href='https://exchange.blockchain.com/trade/signup'
                target='_blank'
              >
                <ExchangeButton
                  fullwidth
                  height='48px'
                  nature='primary'
                  style={{
                    marginTop: '1rem',
                    borderRadius: '8px'
                  }}
                >
                  <FormattedMessage
                    id='scenes.public.register.createExchange'
                    defaultMessage='Create an Exchange Account'
                  />

                  <TabIcon color='white' name='open-in-new-tab' size='24px' />
                </ExchangeButton>
              </Link>
            </Card>
            <SubCard>
              <Text size='14px' color='whiteFade600' weight={500}>
                <FormattedMessage
                  id='scenes.register.exchange.subcard'
                  defaultMessage='You will be taken to our trading experience to continue Sign up.'
                />
              </Text>
            </SubCard>
          </CardWrapper>
        </CardsWrapper>
      </SignupWrapper>
    )
  }
}

export default reduxForm<{}, PropsType>({ form: 'register' })(Register)
