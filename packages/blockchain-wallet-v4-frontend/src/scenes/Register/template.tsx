import {
  Badge,
  Button,
  HeartbeatLoader,
  Icon,
  Link,
  Text
} from 'blockchain-info-components'
import { find, propEq } from 'ramda'
import { FormattedMessage } from 'react-intl'
import { GoalsType } from 'data/goals/types'
import { InjectedFormProps, reduxForm } from 'redux-form'
import { LinkContainer } from 'react-router-bootstrap'
import Header from './Header'
import LinkExchangeAccount from './LinkExchangeAccount'
import media from 'services/ResponsiveService'
import React from 'react'
import SignupForm from './SignupForm'
import styled, { DefaultTheme } from 'styled-components'

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
  background: ${props => props.theme.white};
  border-radius: 0.75rem;
  box-sizing: border-box;

  ${media.tablet`
    width: 100%;
    padding: 1.5rem;
  `}
`
const CardHeader = styled.div`
  align-items: center;
  display: flex;
`
const IconWrapper = styled.div<{ color: keyof DefaultTheme }>`
  display: flex;
  background: ${props => props.theme[props.color]};
  height: 3.5rem;
  width: 3.5rem;
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
  color: ${props => props.theme.white};
  background-color: ${props => props.theme.black};
  position: relative;
  border: none;

  &:hover {
    background-color: ${props => props.theme.greyFade800};
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
  margin: ${props => (props.showForm ? '1.5rem auto 0' : '0')};
  background-color: ${props => props.theme.grey000};
  visibility: ${props => (props.showForm ? 'visible' : 'hidden')};
  transition: all 0.5s ease;
`
const AppButtons = styled.footer<{ showForm: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  width: 100%;
  max-height: ${props => (props.showForm ? '5.25rem' : '0')};
  visibility: ${props => (props.showForm ? 'visible' : 'hidden')};
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
    color: ${props => props.theme.white};
    font-weight: 600;
  }
`

const Register = ({
  busy,
  goals,
  handleSubmit,
  invalid,
  password,
  passwordLength,
  showForm,
  toggleForm
}: InjectedFormProps<{}, Props> & Props) => {
  const isLinkAccountGoal = find(propEq('name', 'linkAccount'), goals)
  const buttonSubmit = showForm ? handleSubmit : toggleForm

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
              <Text size='24px' color='textBlack' weight={600}>
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
                  defaultMessage='Be your own bank.'
                />
              </InfoTitle>

              <InfoItem>
                <Text color='grey800' size='16px' weight={600}>
                  <FormattedMessage
                    id='scenes.register.walletcard.item.1.bold'
                    defaultMessage='Easily buy and sell'
                  />
                </Text>
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
                <Text color='grey600' size='16px' weight={500}>
                  <FormattedMessage
                    id='scenes.register.walletcard.item.2.regular'
                    defaultMessage='crypto on mobile and desktop.'
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
                <Text color='grey600' size='16px' weight={500}>
                  <FormattedMessage
                    id='scenes.register.walletcard.item.3.regular'
                    defaultMessage='by holding your private keys.'
                  />
                </Text>
              </InfoItem>
            </CardInfo>

            {showForm && (
              <SignupForm
                handleSubmit={handleSubmit}
                password={password}
                passwordLength={passwordLength}
              />
            )}

            <Button
              data-e2e='signupButton'
              disabled={showForm ? busy || invalid : showForm}
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

            <Line showForm={showForm} />
            <AppButtons showForm={showForm}>
              <Bottom>
                <Badge type='applestore' />
                <Badge type='googleplay' />
              </Bottom>
            </AppButtons>
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
                <SignInText color='whiteFade900' size='14px' weight={500}>
                  <FormattedMessage
                    id='scenes.register.wallet.signin'
                    defaultMessage='Sign In'
                  />
                </SignInText>
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
              </InfoItem>

              <InfoItem>
                <Text color='grey800' size='16px' weight={600}>
                  <FormattedMessage
                    id='scenes.register.exchangecard.item.2.bold'
                    defaultMessage='Over 20 trading pairs'
                  />
                </Text>
                <Text color='grey600' size='16px' weight={500}>
                  <FormattedMessage
                    id='scenes.register.exchangecard.item.2.regular'
                    defaultMessage='including USD, GBP, and EUR.'
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
                <Text color='grey600' size='16px' weight={500}>
                  <FormattedMessage
                    id='scenes.register.exchangecard.item.3.regular'
                    defaultMessage='by connecting your Wallet.'
                  />
                </Text>
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
          <SubCard>
            <Text size='14px' color='whiteFade600' weight={500}>
              <FormattedMessage
                id='scenes.register.exchange.subcard'
                defaultMessage='You will be taken to our trading experience to continue sign up.'
              />
            </Text>
          </SubCard>
        </CardWrapper>
      </CardsWrapper>
    </SignupWrapper>
  )
}

type Props = {
  busy: boolean
  email: string
  goals: Array<{ data: any; id: string; name: GoalsType }>
  language: string
  password: string
  passwordLength: number
  showForm: boolean
  toggleForm: any
}

export default reduxForm<{}, Props>({ form: 'register' })(Register)
