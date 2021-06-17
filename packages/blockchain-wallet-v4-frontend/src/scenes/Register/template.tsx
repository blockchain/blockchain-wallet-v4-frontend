import React from 'react'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import { find, isEmpty, isNil, propEq, propOr } from 'ramda'
import { InjectedFormProps, reduxForm } from 'redux-form'
import styled, { DefaultTheme } from 'styled-components'

import {
  Badge,
  Button,
  HeartbeatLoader,
  Icon,
  Link,
  Text,
  TextGroup
} from 'blockchain-info-components'
import { SimpleBuyWidgetGoalDataType } from 'data/types'
import { media } from 'services/styles'

import { PropsType as OwnProps } from '.'
import Header from './Header'
import LinkExchangeAccount from './LinkExchangeAccount'
import SignupForm from './SignupForm'
import SimpleBuyInfo from './SimpleBuyInfo'

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
  background: ${(props) => props.theme.white};
  border-radius: 0.75rem;
  box-sizing: border-box;

  ${media.tablet`
    width: 100%;
    padding: 1.5rem;
  `}
`

const SimpleBuyCard = styled(Card)`
  max-width: 27rem;
`

const CardHeader = styled.div`
  align-items: center;
  display: flex;
`
const IconWrapper = styled.div<{ color: keyof DefaultTheme }>`
  display: flex;
  background: ${(props) => props.theme[props.color]};
  height: 3rem;
  width: 3rem;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  margin-right: 1.25rem;

  ${media.tablet`
    height: 2.5rem;
    width: 2.5rem;
    flex-shrink: 0;
  `}
`
const CardInfo = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 2rem;
`
const InfoTitle = styled(Text)`
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
`
const InfoItem = styled.div`
  display: flex;
  margin-bottom: 0.75rem;
  justify-content: flex-start;
  flex-wrap: wrap;

  > div:first-child {
    margin-right: 8px;

    ${media.tablet`
      margin-bottom: 4px;
    `}
  }
`
const SubCard = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1.25rem;
  margin-bottom: 2.5rem;
`
const ExchangeButton = styled(Button)`
  color: ${(props) => props.theme.white};
  background-color: ${(props) => props.theme.black};
  position: relative;
  border: none;

  &:hover {
    background-color: ${(props) => props.theme.greyFade800};
  }
`
const TabIcon = styled(Icon)`
  position: absolute;
  right: 1rem;

  ${media.tablet`
    display: none;
  `}
`
const Line = styled.div<{ showForm: boolean }>`
  height: 1px;
  width: 12.5rem;
  margin: ${(props) => (props.showForm ? '1.5rem auto 0' : '0')};
  background-color: ${(props) => props.theme.grey000};
  visibility: ${(props) => (props.showForm ? 'visible' : 'hidden')};
  transition: all 0.5s ease;
`
const AppButtons = styled.footer<{ showForm: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  width: 100%;
  max-height: ${(props) => (props.showForm ? '5.25rem' : '0')};
  visibility: ${(props) => (props.showForm ? 'visible' : 'hidden')};
  transition: all 0.5s ease;
  ${media.mobile`
    img {
      height: auto;
      width: 40%;
    }
  `};
`
const Bottom = styled.div`
  margin: 2rem 0 0;
  > a {
    margin: 0 8px;
  }
`
const SignInText = styled(Text)`
  &:hover {
    color: ${(props) => props.theme.white};
    font-weight: 600;
  }
`
const LinkAccountSpacer = styled.div`
  height: 1rem;
`

const SignupCard = ({
  busy,
  handleSubmit,
  invalid,
  isLinkAccountGoal,
  isSimpleBuyGoal,
  password,
  passwordLength,
  showForm,
  toggleForm
}: InjectedFormProps<{}, Props> & Props) => {
  const buttonSubmit = showForm ? handleSubmit : toggleForm
  return (
    <CardWrapper>
      <Card>
        <CardHeader>
          <IconWrapper color='blue600'>
            <Icon color='white' name='wallet-filled' size='28px' />
          </IconWrapper>
          <Text size='24px' color='textBlack' weight={600}>
            {isLinkAccountGoal ? (
              <FormattedMessage
                id='scenes.register.walletcard.linktitle'
                defaultMessage='Create a New Wallet'
              />
            ) : (
              <FormattedMessage
                id='scenes.register.walletcard.title'
                defaultMessage='Blockchain Wallet'
              />
            )}
          </Text>
        </CardHeader>

        {isLinkAccountGoal ? (
          <LinkAccountSpacer />
        ) : (
          <CardInfo>
            <InfoTitle color='grey800' size='18px' weight={600}>
              <FormattedMessage
                id='scenes.register.walletcard.infotitleuppercase'
                defaultMessage='Be Your Own Bank'
              />
            </InfoTitle>

            <InfoItem>
              <TextGroup inline>
                <Text color='grey800' size='16px' weight={600}>
                  <FormattedMessage
                    id='scenes.register.walletcard.item.1.bold'
                    defaultMessage='Easily buy and sell'
                  />
                </Text>
                <Text color='grey600' size='16px' weight={500}>
                  <FormattedMessage
                    id='scenes.register.walletcard.item.1.regular1'
                    defaultMessage='Bitcoin, Ether and more.'
                  />
                </Text>
              </TextGroup>
            </InfoItem>

            <InfoItem>
              <TextGroup inline>
                <Text color='grey800' size='16px' weight={600}>
                  <FormattedMessage
                    id='scenes.register.walletcard.item.2.bold'
                    defaultMessage='Securely store your'
                  />
                </Text>
                <Text color='grey600' size='16px' weight={500}>
                  <FormattedMessage
                    id='scenes.register.walletcard.item.2.regular'
                    defaultMessage='crypto on mobile and desktop.'
                  />
                </Text>
              </TextGroup>
            </InfoItem>

            <InfoItem>
              <TextGroup inline>
                <Text color='grey800' size='16px' weight={600}>
                  <FormattedMessage
                    id='scenes.register.walletcard.item.3.bold'
                    defaultMessage='Control your money'
                  />
                </Text>
                <Text color='grey600' size='16px' weight={500}>
                  <FormattedMessage
                    id='scenes.register.walletcard.item.3.regular'
                    defaultMessage='by holding your private keys.'
                  />
                </Text>
              </TextGroup>
            </InfoItem>
          </CardInfo>
        )}

        {showForm || isLinkAccountGoal ? (
          <SignupForm
            busy={busy}
            handleSubmit={handleSubmit}
            invalid={invalid}
            password={password}
            passwordLength={passwordLength}
          />
        ) : (
          <Button
            data-e2e='signupButton'
            fullwidth
            height='48px'
            nature='primary'
            onClick={buttonSubmit}
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
        )}
        {!isLinkAccountGoal && (
          <>
            <Line showForm={showForm} />
            <AppButtons showForm={showForm}>
              <Bottom>
                <Badge type='applestore' />
                <Badge type='googleplay' />
              </Bottom>
            </AppButtons>
          </>
        )}
      </Card>

      <LinkContainer to='/login'>
        <Link>
          <SubCard>
            <Text size='14px' color='white' weight={500}>
              <FormattedMessage
                id='scenes.register.wallet.link'
                defaultMessage='Already have a wallet?'
              />
            </Text>
            &nbsp;
            <SignInText color='white' size='14px' weight={500}>
              <FormattedMessage id='scenes.register.wallet.signin' defaultMessage='Sign In' />
            </SignInText>
            <Icon size='18px' color='white' name='arrow-right' />
          </SubCard>
        </Link>
      </LinkContainer>
    </CardWrapper>
  )
}

const Register = (props: InjectedFormProps<{}, Props> & Props) => {
  const { goals, isLinkAccountGoal, isSimpleBuyGoal } = props
  const dataGoal = find(propEq('name', 'simpleBuy'), goals)
  const goalData: SimpleBuyWidgetGoalDataType = propOr({}, 'data', dataGoal)

  if (isLinkAccountGoal) {
    return (
      <SignupWrapper>
        <CardsWrapper>
          <LinkExchangeAccount />
          <SignupCard {...props} />
        </CardsWrapper>
      </SignupWrapper>
    )
  }

  if (isSimpleBuyGoal) {
    return (
      <SignupWrapper>
        <CardsWrapper>
          <SimpleBuyCard>
            <CardHeader>
              <Text size='24px' color='textBlack' weight={600}>
                <FormattedMessage
                  defaultMessage='Sign Up to Continue Your Crypto Purchase.'
                  id='scenes.register.simplebuy.signup'
                />
              </Text>
            </CardHeader>

            {!isNil(goalData) &&
              !isEmpty(goalData) &&
              !!goalData.fiatCurrency &&
              !!goalData.crypto &&
              !!goalData.amount && (
                <>
                  <SimpleBuyInfo goalData={goalData} supportedCoins={props.supportedCoins} />

                  <Text size='14px' color='grey600' weight={500}>
                    <FormattedMessage
                      id='scenes.register.simplebuy.change'
                      defaultMessage='You will be able to change your amount later.'
                    />
                  </Text>
                </>
              )}

            <SignupForm
              busy={props.busy}
              handleSubmit={props.handleSubmit}
              invalid={props.invalid}
              password={props.password}
              passwordLength={props.passwordLength}
            />
          </SimpleBuyCard>
        </CardsWrapper>
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
              <SignInText color='whiteFade900' size='14px' weight={500}>
                <FormattedMessage id='scenes.register.wallet.signin' defaultMessage='Sign In' />
              </SignInText>
            </SubCard>
          </Link>
        </LinkContainer>
      </SignupWrapper>
    )
  }

  return (
    <SignupWrapper>
      <Header />
      <CardsWrapper>
        <SignupCard {...props} />

        <CardWrapper>
          <Card>
            <CardHeader>
              <IconWrapper color='black'>
                <Icon color='white' name='blockchain-logo' size='32px' />
              </IconWrapper>
              <Text size='24px' color='textBlack' weight={600}>
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
                <TextGroup inline>
                  <Text color='grey800' size='16px' weight={600}>
                    <FormattedMessage
                      id='scenes.register.exchangecard.item.1.bold'
                      defaultMessage='Lightning-fast trades'
                    />
                  </Text>
                  <Text color='grey600' size='16px' weight={500}>
                    <FormattedMessage
                      id='scenes.register.exchangecard.item.1.regular'
                      defaultMessage='mean you get the best price.'
                    />
                  </Text>
                </TextGroup>
              </InfoItem>

              <InfoItem>
                <TextGroup inline>
                  <Text color='grey800' size='16px' weight={600}>
                    <FormattedMessage
                      id='scenes.register.exchangecard.item.2.bold1'
                      defaultMessage='Many trading pairs'
                    />
                  </Text>
                  <Text color='grey600' size='16px' weight={500}>
                    <FormattedMessage
                      id='scenes.register.exchangecard.item.2.regular1'
                      defaultMessage='including USD, GBP and EUR.'
                    />
                  </Text>
                </TextGroup>
              </InfoItem>

              <InfoItem>
                <TextGroup inline>
                  <Text color='grey800' size='16px' weight={600}>
                    <FormattedMessage
                      id='scenes.register.exchangecard.item.3.bold'
                      defaultMessage='Control your money'
                    />
                  </Text>
                  <Text color='grey600' size='16px' weight={500}>
                    <FormattedMessage
                      id='scenes.register.exchangecard.item.3.regular'
                      defaultMessage='by connecting your Wallet.'
                    />
                  </Text>
                </TextGroup>
              </InfoItem>
            </CardInfo>
            <Link
              href='https://exchange.blockchain.com/trade/signup?utm_source=web_wallet&utm_medium=referral&utm_campaign=wallet_register_page'
              target='_blank'
            >
              <ExchangeButton
                data-e2e='createExchangeAccount'
                fullwidth
                height='48px'
                nature='primary'
                style={{
                  borderRadius: '8px'
                }}
              >
                <Text color='white' size='16px' weight={600}>
                  <FormattedMessage
                    id='scenes.public.register.createExchange'
                    defaultMessage='Create an Exchange Account'
                  />
                </Text>

                <TabIcon color='white' name='open-in-new-tab' size='24px' />
              </ExchangeButton>
            </Link>
          </Card>
        </CardWrapper>
      </CardsWrapper>
    </SignupWrapper>
  )
}

type Props = {
  busy: boolean
  isLinkAccountGoal: boolean
  isSimpleBuyGoal: boolean
  password: string
  passwordLength: number
  showForm: boolean
  toggleForm: any
} & OwnProps

export default reduxForm<{}, Props>({ form: 'register' })(Register)
