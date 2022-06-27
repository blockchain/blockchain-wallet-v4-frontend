import React from 'react'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import styled from 'styled-components'

import { Button, Image, Text } from 'blockchain-info-components'
import { Wrapper } from 'components/Public'

import { Props as OwnProps } from '.'

const ContentWrapper = styled.div`
  display: flex;
  text-align: center;
  align-items: center;
  flex-direction: column;
`

const ExchangeMobileUserConflict = ({ authActions, email, showExchangeLoginButton }: Props) => {
  return (
    <>
      <Wrapper>
        <ContentWrapper>
          <Image name='warning-circle-filled' width='44px' />
          <Text
            size='20px'
            weight={600}
            color='black'
            style={{ marginTop: '8px' }}
            lineHeight='1.5'
          >
            <FormattedMessage
              id='scenes.register.exchange.user_conflict.title'
              defaultMessage='Exchange Account Already Exists'
            />
          </Text>
          <Text
            color='grey900'
            style={{ marginTop: '8px' }}
            size='16px'
            weight={500}
            lineHeight='1.5'
          >
            <FormattedMessage
              id='scenes.register.exchange.user_conflict_mobile.copy'
              defaultMessage='You already have an Exchange account associated with {email}.'
              values={{
                email
              }}
            />
          </Text>
          {showExchangeLoginButton ? (
            <Button
              data-e2e='openExchange'
              fullwidth
              height='48px'
              nature='primary'
              style={{ marginTop: '16px' }}
              onClick={() => authActions.sendLoginMessageToMobile()}
            >
              <Text color='white' size='16px' weight={600}>
                <FormattedMessage
                  id='scenes.register.exchange.user_conflict_mobile.log_into_exchange'
                  defaultMessage='Log In Here'
                />
              </Text>
            </Button>
          ) : (
            <Text
              color='grey900'
              style={{ marginTop: '8px' }}
              size='16px'
              weight={500}
              lineHeight='1.5'
            >
              <FormattedMessage
                id='scenes.register.exchange.user_conflict_mobile.log_into_exchange.text'
                defaultMessage='Go back and log into your account.'
              />
            </Text>
          )}
        </ContentWrapper>
      </Wrapper>
    </>
  )
}

type Props = {
  email: string
  showExchangeLoginButton: boolean
} & OwnProps

export default ExchangeMobileUserConflict
