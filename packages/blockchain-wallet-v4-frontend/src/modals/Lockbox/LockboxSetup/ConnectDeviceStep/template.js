import React from 'react'
import styled from 'styled-components'
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl'

import {
  Button,
  Icon,
  Image,
  Link,
  TextGroup,
  Text
} from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`
const TimeoutWrapper = styled(Wrapper)`
  align-items: center;
  justify-content: center;
`
const Instructions = styled(TextGroup)`
  margin-top: 12px;
`
const StepText = styled(Text)`
  margin-bottom: 8px;
`
const ButtonContainer = styled.div`
  margin-top: 28px;
`
const TimeoutText = styled(Text)`
  margin: 10px 0 25px;
`
const SupportText = styled(Link)`
  margin: 35px 0 8px;
`
const ConnectDeviceStep = props => {
  const {
    connectTimeout,
    deviceType,
    isConnected,
    isNewSetup,
    handleStepChange,
    onTimeoutAccept,
    supportLink
  } = props

  return connectTimeout ? (
    <TimeoutWrapper>
      <Icon name='pending' weight='400' size='40px' color='warn' />
      <TimeoutText size='20px' weight={400}>
        <FormattedMessage
          id='modals.lockboxsetup.connectdevice.timeout.header'
          defaultMessage='Are you still here?'
        />
      </TimeoutText>
      <TimeoutText size='13px' weight={300}>
        <FormattedHTMLMessage
          id='modals.lockboxsetup.connectdevice.timeout.intro'
          defaultMessage="It looks like you may be having trouble setting up your {deviceType}. If you're still setting up the device, click the 'Continue' button and continue working or contact support for assistance."
          values={{ deviceType }}
        />
      </TimeoutText>
      <SupportText href={supportLink} target='_blank' size='11px' weight={400}>
        <FormattedMessage
          id='modals.lockboxsetup.connectdevice.timeout.support'
          defaultMessage='Contact Support'
        />
      </SupportText>
      <Button fullwidth onClick={onTimeoutAccept} nature={'primary'}>
        <FormattedMessage
          id='modals.lockboxsetup.connectdevice.timeout.continue'
          defaultMessage='Continue Setup'
        />
      </Button>
    </TimeoutWrapper>
  ) : (
    <Wrapper>
      <Image
        style={{ marginBottom: '18px' }}
        name='lockbox-onboard-connect'
        width='100%'
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
