import React from 'react'
import { FormattedMessage } from 'react-intl'
import { InjectedFormProps } from 'redux-form'
import styled from 'styled-components'

import { Button, Icon, Link, Text, TextGroup } from 'blockchain-info-components'
import { media } from 'services/styles'

import {
  Card,
  CardHeader,
  CardInfo,
  CardsWrapper,
  CardWrapper,
  IconWrapper,
  InfoItem,
  InfoTitle
} from '../components'
import Header from '../components/Header'
import SignupCard from '../components/SignupCard'
import { SubviewProps } from '../types'

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

const SignupLanding = (props: InjectedFormProps<{}, SubviewProps> & SubviewProps) => (
  <>
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
              style={{ borderRadius: '8px' }}
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
  </>
)

export default SignupLanding
