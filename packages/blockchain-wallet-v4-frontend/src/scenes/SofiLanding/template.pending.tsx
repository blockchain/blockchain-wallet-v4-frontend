import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import { Button, Text } from 'blockchain-info-components'
import { Wrapper } from 'components/Public'
import { actions } from 'data'

const ContentWrapper = styled.div`
  display: flex;
  text-align: center;
  align-items: center;
  flex-direction: column;
`

const SofiPendingLanding = () => {
  const dispatch = useDispatch()

  return (
    <Wrapper>
      <ContentWrapper>
        <Text size='20px' weight={600} color='black' lineHeight='1.5' style={{ marginTop: '8px' }}>
          <FormattedMessage
            id='scenes.sofi.welcome.header'
            defaultMessage='Welcome to Blockchain.com!'
          />
        </Text>
        <Text
          color='grey600'
          lineHeight='1.5'
          style={{ marginBottom: '16px', marginTop: '8px' }}
          size='16px'
          weight={500}
        >
          <FormattedMessage
            id='scenes.sofi.signup.welcome.body.pending'
            defaultMessage='Your account migration is already pending.'
          />
        </Text>
        <Button
          data-e2e='existingSofi'
          fullwidth
          nature='dark'
          onClick={() => dispatch(actions.router.push('/login'))}
        >
          <Text color='white' size='16px' weight={600}>
            <FormattedMessage
              id='scenes.sofi.signup.welcome.existing.login'
              defaultMessage='Log into your account'
            />
          </Text>
        </Button>
      </ContentWrapper>
    </Wrapper>
  )
}

export default SofiPendingLanding
