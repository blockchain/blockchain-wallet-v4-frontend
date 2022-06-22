import React from 'react'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import styled from 'styled-components'

import { Button, Image, Text } from 'blockchain-info-components'
import { Wrapper } from 'components/Public'

const ContentWrapper = styled.div`
  display: flex;
  text-align: center;
  align-items: center;
  flex-direction: column;
`

const ExchangeUserConflict = ({ email, walletRedirect }: Props) => {
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
              id='scenes.register.exchange.user_conflict.copy'
              defaultMessage='You already have an Exchange account associated with {email}. Your funds are safe.'
              values={{
                email
              }}
            />
          </Text>

          <Button
            data-e2e='openWallet'
            fullwidth
            height='48px'
            nature='primary'
            style={{ marginBottom: '16px', marginTop: '32px' }}
            onClick={walletRedirect}
          >
            <Text color='white' size='16px' weight={600}>
              <FormattedMessage
                id='scenes.register.exchange.user_conflict.open_wallet'
                defaultMessage='Open Wallet ->'
              />
            </Text>
          </Button>
          <LinkContainer to='/login?product=exchange'>
            <Button data-e2e='openExchange' fullwidth height='48px' nature='light'>
              <Text color='blue600' size='16px' weight={600}>
                <FormattedMessage
                  id='scenes.register.exchange.user_conflict.log_into_exchange'
                  defaultMessage='Log In to Exchange ->'
                />
              </Text>
            </Button>
          </LinkContainer>
        </ContentWrapper>
      </Wrapper>
    </>
  )
}

type Props = {
  email: string
  walletRedirect: () => void
}

export default ExchangeUserConflict
