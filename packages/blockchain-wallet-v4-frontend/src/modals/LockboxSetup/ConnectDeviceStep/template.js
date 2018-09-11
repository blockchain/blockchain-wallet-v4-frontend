import React from 'react'
import styled from 'styled-components'
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl'

import { Button, TextGroup, Text } from 'blockchain-info-components'

const Wrapper = styled.div`
  padding: 20px;
`

const Title = styled.div`
  text-align: center;
  margin-bottom: 40px;
`

const StepText = styled(Text)`
  margin-bottom: 20px;
  .number {
    font-size: 20px;
    font-weight: 400;
    margin-right: 10px;
    color: ${props => props.theme['brand-secondary']};
  }
`

const ButtonContainer = styled.div`
  margin-top: 30px;
`

const ConnectDeviceStep = props => {
  const { isConnected } = props

  return (
    <Wrapper>
      <Title>
        <Text>
          <FormattedMessage
            id='modals.lockboxsetup.setuptypestep.connect'
            defaultMessage='Connect Your Lockbox'
          />
        </Text>
      </Title>
      <TextGroup>
        <StepText size='16px' weight={300}>
          <span className='number'>1. </span>
          <FormattedHTMLMessage
            id='modals.lockboxsetup.connectdevice.step1'
            defaultMessage='Insert your Lockbox into your computer'
          />
        </StepText>
        <StepText size='16px' weight={300}>
          <span className='number'>2. </span>
          <FormattedHTMLMessage
            id='modals.lockboxsetup.connectdevice.step2'
            defaultMessage='Press both buttons on your Lockbox to begin'
          />
        </StepText>
        <StepText size='16px' weight={300}>
          <span className='number'>3. </span>
          <FormattedHTMLMessage
            id='modals.lockboxsetup.connectdevice.step3'
            defaultMessage='Set your pin'
          />
        </StepText>
        <StepText size='16px' weight={300}>
          <span className='number'>4. </span>
          <FormattedHTMLMessage
            id='modals.lockboxsetup.connectdevice.step4'
            defaultMessage='Complete backup phrase process'
          />
        </StepText>
      </TextGroup>
      <ButtonContainer>
        { isConnected ? (
            <Button
              nature='success'
              onClick={() => props.handleStepChange()}
              fullwidth>
              <FormattedMessage
                id='modals.lockboxsetup.connectdevice.success'
                defaultMessage='Success! Click to Continue'
              />
            </Button>
          ) : (
          <Button nature='gray' disabled fullwidth>
            <FormattedMessage
              id='modals.lockboxsetup.connectdevice.connect'
              defaultMessage='Connect Your Lockbox'
            />
          </Button>
          )
        }
      </ButtonContainer>
    </Wrapper>
  )
}

export default ConnectDeviceStep
