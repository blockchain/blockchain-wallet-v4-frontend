import React from 'react'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import { InjectedFormProps } from 'redux-form'
import styled from 'styled-components'

import {
  Badge,
  Button,
  HeartbeatLoader,
  Icon,
  Link,
  Text,
  TextGroup
} from 'blockchain-info-components'
import { media } from 'services/styles'

import { SubviewProps } from '../../types'
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
} from '..'
import SignupForm from '../SignupForm'

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
const LinkAccountSpacer = styled.div`
  height: 1rem;
`

const SignupCard = (props: InjectedFormProps<{}, SubviewProps> & SubviewProps) => {
  const {
    isFormSubmitting,
    isLinkAccountGoal,
    onSignupSubmit,
    showForm,
    toggleSignupFormVisibility
  } = props
  const buttonSubmit = showForm ? onSignupSubmit : toggleSignupFormVisibility

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
          <SignupForm {...props} />
        ) : (
          <Button
            data-e2e='signupButton'
            fullwidth
            height='48px'
            nature='primary'
            // @ts-ignore
            onClick={buttonSubmit}
            style={{
              borderRadius: '8px'
            }}
            type='submit'
          >
            {isFormSubmitting ? (
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

export default SignupCard
