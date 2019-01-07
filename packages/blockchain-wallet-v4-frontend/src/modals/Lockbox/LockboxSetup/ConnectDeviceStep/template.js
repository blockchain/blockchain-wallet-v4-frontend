import React from 'react'
import styled from 'styled-components'
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl'
import { Button, Image, TextGroup, Text } from 'blockchain-info-components'
import { RotateSync } from 'components/RotateSync'

const Wrapper = styled.div``
const Instructions = styled(TextGroup)`
  margin-top: 12px;
`
const StepText = styled(Text)`
  margin-bottom: 8px;
`
const ButtonContainer = styled.div`
  margin-top: 30px;
`
const ConnectDeviceStep = props => {
  const { deviceType, isConnected, isNewSetup, handleStepChange } = props

  return (
    <Wrapper>
      <Image
        name='lockbox-onboard-link'
        width='100%'
        srcset={{ 'lockbox-onboard-link': '1x' }}
      />
      {isNewSetup ? (
        <Instructions>
          <StepText size='13px' weight={300}>
            <FormattedHTMLMessage
              id='modals.lockboxsetup.connectdevice.new.stepone'
              defaultMessage='1. Connect your {deviceType} to your computer with the supplied USB cable.'
              values={{ deviceType }}
            />
          </StepText>
          <StepText size='13px' weight={300}>
            <FormattedHTMLMessage
              id='modals.lockboxsetup.connectdevice.new.steptwo'
              defaultMessage='2. Press both buttons on the top of your {deviceType} to begin.'
              values={{ deviceType }}
            />
          </StepText>
          <StepText size='13px' weight={300}>
            <FormattedHTMLMessage
              id='modals.lockboxsetup.connectdevice.new.stepthree'
              defaultMessage='3. Set a pin for your device.'
            />
          </StepText>
          <StepText size='13px' weight={300}>
            <FormattedHTMLMessage
              id='modals.lockboxsetup.connectdevice.new.stepfour'
              defaultMessage='4. Complete backup phrase process.'
            />
          </StepText>
          <StepText size='13px' weight={300}>
            <FormattedHTMLMessage
              id='modals.lockboxsetup.connectdevice.new.stepfive'
              defaultMessage="5. Ensure your device's dashboard is open. Hint: You should see the settings icon."
            />
          </StepText>
        </Instructions>
      ) : (
        <Instructions>
          <StepText size='13px' weight={300}>
            <FormattedHTMLMessage
              id='modals.lockboxsetup.connectdevice.existing.stepone'
              defaultMessage='1. Connect your {deviceType} to your computer with the supplied USB cable.'
              values={{ deviceType }}
            />
          </StepText>
          <StepText size='13px' weight={300}>
            <FormattedHTMLMessage
              id='modals.lockboxsetup.connectdevice.existing.steptwo'
              defaultMessage='2. Enter your pin for your device.'
            />
          </StepText>
          <StepText size='13px' weight={300}>
            <FormattedHTMLMessage
              id='modals.lockboxsetup.connectdevice.existing.stepthree'
              defaultMessage='3. Ensure the device dashboard is open and you are not in an application.'
            />
          </StepText>
        </Instructions>
      )}
      <ButtonContainer>
        <Button
          fullwidth
          disabled={!isConnected}
          onClick={handleStepChange}
          nature={isConnected ? 'primary' : 'dark'}
        >
          {isConnected ? (
            <FormattedMessage
              id='modals.lockboxsetup.connectdevice.success'
              defaultMessage='Success! Click to Continue'
            />
          ) : (
            <FormattedMessage
              id='modals.lockboxsetup.connectdevice.waiting'
              defaultMessage='Waiting...'
            />
          )}
        </Button>
      </ButtonContainer>
    </Wrapper>
  )
}

export default ConnectDeviceStep
