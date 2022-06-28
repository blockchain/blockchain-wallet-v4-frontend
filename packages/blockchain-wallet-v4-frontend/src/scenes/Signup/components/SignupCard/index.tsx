import React from 'react'
import { FormattedMessage } from 'react-intl'
import { InjectedFormProps } from 'redux-form'
import styled from 'styled-components'

import { Badge, Button, HeartbeatLoader, Text, TextGroup } from 'blockchain-info-components'
import { PlatformTypes } from 'data/types'
import { media } from 'services/styles'

import { SubviewProps } from '../../types'
import {
  Card,
  CardInfo,
  CardTitle,
  CardWrapper,
  InfoItem,
  InfoTitle,
  LoginLink,
  PaddingWrapper
} from '..'
import SignupForm from '../SignupForm'

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

const SignupCard = (props: InjectedFormProps<{}> & SubviewProps) => {
  const {
    isFormSubmitting,
    isLinkAccountGoal,
    onSignupSubmit,
    showForm,
    signupMetadata,
    toggleSignupFormVisibility
  } = props
  const buttonSubmit = showForm ? onSignupSubmit : toggleSignupFormVisibility
  const showOnlySignup = showForm || isLinkAccountGoal
  const { platform } = signupMetadata
  const isExchangeMobileSignup =
    platform === PlatformTypes.ANDROID || platform === PlatformTypes.IOS
  return (
    <CardWrapper hideMargin={showOnlySignup}>
      <Card>
        <PaddingWrapper>
          <CardTitle>
            <Text size='24px' color='textBlack' weight={600} lineHeight='1.5'>
              {isLinkAccountGoal ? (
                <FormattedMessage
                  id='scenes.register.walletcard.linktitle'
                  defaultMessage='Create a New Wallet'
                />
              ) : (
                <FormattedMessage
                  id='scenes.recover.import.header'
                  defaultMessage='Create Your Blockchain.com Account'
                />
              )}
            </Text>
            <Text
              color='textBlack'
              size='16px'
              weight={500}
              lineHeight='1.5'
              style={{ marginTop: '8px' }}
            >
              <FormattedMessage
                id='scenes.register.getstarted'
                defaultMessage='Get Started For Free by Signing Up Now.'
              />
            </Text>
          </CardTitle>

          {isLinkAccountGoal ? (
            <LinkAccountSpacer />
          ) : (
            !showOnlySignup && (
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
            )
          )}

          {showOnlySignup ? (
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
                  <FormattedMessage id='buttons.continue' defaultMessage='Continue' />
                </Text>
              )}
            </Button>
          )}
        </PaddingWrapper>
        {!isLinkAccountGoal && !isExchangeMobileSignup && (
          <>
            <AppButtons showForm={showForm}>
              <Bottom>
                <Badge type='applestore' />
                <Badge type='googleplay' />
              </Bottom>
            </AppButtons>
          </>
        )}
        {isExchangeMobileSignup ? (
          <Bottom />
        ) : (
          <LoginLink analyticsActions={props.analyticsActions} unified={props.unified} />
        )}
      </Card>
    </CardWrapper>
  )
}

export default SignupCard
