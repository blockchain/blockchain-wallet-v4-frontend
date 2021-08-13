import React from 'react'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import { find, isEmpty, isNil, propEq, propOr } from 'ramda'
import { InjectedFormProps, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { Button, Icon, Link, Text, TextGroup } from 'blockchain-info-components'
import { SimpleBuyWidgetGoalDataType } from 'data/types'
import { media } from 'services/styles'

import { PropsType as OwnProps } from '.'
import {
  Card,
  CardHeader,
  CardInfo,
  CardWrapper,
  IconWrapper,
  InfoItem,
  InfoTitle,
  SignInText,
  SubCard
} from './components'
import Header from './components/Header'
import SignupCard from './components/RegisterCard'
import LinkExchangeAccount from './LinkExchangeAccount'
import { REGISTER_FORM } from './model'
import RegisterForm from './RegisterForm'
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
const SimpleBuyCard = styled(Card)`
  max-width: 27rem;
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

const Register = (props: InjectedFormProps<{}, Props> & Props) => {
  const {
    formValues,
    goals,
    handleSubmit,
    invalid,
    isFormSubmitting,
    isLinkAccountGoal,
    isSimpleBuyGoal,
    onCountrySelect,
    showState
  } = props
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
                  <SimpleBuyInfo goalData={goalData} />

                  <Text size='14px' color='grey600' weight={500}>
                    <FormattedMessage
                      id='scenes.register.simplebuy.change'
                      defaultMessage='You will be able to change your amount later.'
                    />
                  </Text>
                </>
              )}

            <RegisterForm
              isFormSubmitting={isFormSubmitting}
              handleSubmit={handleSubmit}
              invalid={invalid}
              formValues={formValues}
              onCountrySelect={onCountrySelect}
              showState={showState}
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
  isFormSubmitting: boolean
  isLinkAccountGoal: boolean
  isSimpleBuyGoal: boolean
  onCountrySelect: (e: React.SyntheticEvent, value: string) => void
  showForm: boolean
  showState: boolean
  toggleForm: any
} & OwnProps

export default reduxForm<{}, Props>({ form: REGISTER_FORM })(Register)
