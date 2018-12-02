import React from 'react'
import styled from 'styled-components'
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl'
import { Button, Image, TextGroup, Text } from 'blockchain-info-components'
import { RotateSync } from 'components/RotateSync'

const Wrapper = styled.div``

const Title = styled.div`
  text-align: center;
  margin-bottom: 20px;
`

const StepText = styled(Text)`
  margin-bottom: 20px;
`

const ImageContainer = styled.div`
  position: relative;
  padding-bottom: 57%;
  img {
    position: absolute;
    left: 0;
    top: 0;
  }
`

const ButtonContainer = styled.div`
  margin-top: 20px;
`

const RotateSyncContainer = styled(RotateSync)`
  margin-left: 15px;
`

const ConnectDeviceStep = props => {
  const { isConnected, isNewSetup } = props

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
      {isNewSetup ? (
        <TextGroup>
          <StepText size='14px' weight={300}>
            <FormattedHTMLMessage
              id='modals.lockboxsetup.connectdevice.new.step1'
              defaultMessage='1. Insert your Lockbox into your computer'
            />
          </StepText>
          <StepText size='14px' weight={300}>
            <FormattedHTMLMessage
              id='modals.lockboxsetup.connectdevice.new.step2'
              defaultMessage='2. Press both buttons on your Lockbox to begin'
            />
          </StepText>
          <StepText size='14px' weight={300}>
            <FormattedHTMLMessage
              id='modals.lockboxsetup.connectdevice.new.step3'
              defaultMessage='3. Set your pin'
            />
          </StepText>
          <StepText size='14px' weight={300}>
            <FormattedHTMLMessage
              id='modals.lockboxsetup.connectdevice.new.step4'
              defaultMessage='4. Complete backup phrase process'
            />
          </StepText>
        </TextGroup>
      ) : (
        <TextGroup>
          <StepText size='14px' weight={300}>
            <FormattedHTMLMessage
              id='modals.lockboxsetup.connectdevice.existing.step1'
              defaultMessage='1. Insert your Lockbox into your computer'
            />
          </StepText>
          <StepText size='14px' weight={300}>
            <FormattedHTMLMessage
              id='modals.lockboxsetup.connectdevice.existing.step2'
              defaultMessage='2. Press both buttons on your Lockbox to begin'
            />
          </StepText>
          <StepText size='14px' weight={300}>
            <FormattedHTMLMessage
              id='modals.lockboxsetup.connectdevice.existing.step3'
              defaultMessage='3. Enter your pin'
            />
          </StepText>
          <StepText size='14px' weight={300}>
            <FormattedHTMLMessage
              id='modals.lockboxsetup.connectdevice.existing.step4'
              defaultMessage='4. Ensure the Dashboard is open'
            />
          </StepText>
        </TextGroup>
      )}

      <ImageContainer>
        <Image
          name='lockbox-onboard-link'
          width='100%'
          srcset={{
            'lockbox-onboard-link2': '2x',
            'lockbox-onboard-link3': '3x'
          }}
        />
      </ImageContainer>
      <ButtonContainer>
        <Button
          fullwidth
          disabled={!isConnected}
          onClick={() => props.handleStepChange()}
          nature={isConnected ? 'success' : 'dark'}
        >
          {isConnected ? (
            <FormattedMessage
              id='modals.lockboxsetup.connectdevice.success'
              defaultMessage='Success! Click to Continue'
            />
          ) : (
            <FormattedMessage
              id='modals.lockboxsetup.connectdevice.connect'
              defaultMessage='Connect Your Lockbox'
            />
          )}
          {!isConnected && <RotateSyncContainer size='14px' color='white' />}
        </Button>
      </ButtonContainer>
    </Wrapper>
  )
}

export default ConnectDeviceStep
