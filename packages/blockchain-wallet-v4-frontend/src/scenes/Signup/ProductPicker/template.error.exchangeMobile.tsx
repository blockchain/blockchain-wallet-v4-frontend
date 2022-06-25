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

const ExchangeMobileUserConflict = ({ email }: Props) => {
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
          <Button
            data-e2e='openExchange'
            fullwidth
            height='48px'
            nature='primary'
            style={{ marginTop: '16px' }}
          >
            <Text color='white' size='16px' weight={600}>
              <FormattedMessage
                id='scenes.register.exchange.user_conflict_mobile.log_into_exchange'
                defaultMessage='Log In Here'
              />
            </Text>
          </Button>
        </ContentWrapper>
      </Wrapper>
    </>
  )
}

type Props = {
  email: string
}

export default ExchangeMobileUserConflict
