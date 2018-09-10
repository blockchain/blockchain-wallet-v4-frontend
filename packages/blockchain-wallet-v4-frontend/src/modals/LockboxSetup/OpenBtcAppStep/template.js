import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Button, Text } from 'blockchain-info-components'

const Wrapper = styled.div`
  padding: 20px;
`

const Title = styled.div`
  text-align: center;
  margin-bottom: 40px;
`

const Content = styled.div`
  text-align: center;
  max-width: 400px;
  margin: 0 auto;
`

const ButtonContainer = styled.div`
  margin-top: 30px;
`

const OpenBtcAppStep = props => {
  const { isReady } = props

  return (
    <Wrapper>
      <Title>
        <Text>
          <FormattedMessage
            id='modals.lockboxsetup.openbtcappstep.title'
            defaultMessage='Your Blockchain Lockbox + Blockchain Wallet'
          />
        </Text>
      </Title>
      <Content>
        <Text size='16px' weight={300}>
          <FormattedMessage
            id='modals.lockboxsetup.openbtcappstep.explanation'
            defaultMessage="Select 'Bitcoin' on your device to connect your Lockbox with your wallet"
          />
        </Text>
      </Content>
      <ButtonContainer>
        {isReady ? (
          <Button
            nature='success'
            onClick={() => props.handleStepChange()}
            fullwidth
          >
            <FormattedMessage
              id='modals.lockboxsetup.openbtcappstep.success'
              defaultMessage='Success! Click to Continue'
            />
          </Button>
        ) : (
          <Button nature='gray' disabled fullwidth>
            <FormattedMessage
              id='modals.lockboxsetup.openbtcappstep.loading'
              defaultMessage='Open Your Bitcoin App'
            />
          </Button>
        )}
      </ButtonContainer>
    </Wrapper>
  )
}

export default OpenBtcAppStep
