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
  text-align: center;
  margin-top: 20px;
`
const Row = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  margin-bottom: 10px;
  & > :first-child {
    margin-right: 14px;
  }
`
const Instructions = styled(TextGroup)`
  margin-top: 12px;
`
const StepText = styled(Text)`
  margin-bottom: 8px;
`
const ButtonContainer = styled.div`
  margin-top: 20px;
`
const TimeoutText = styled(Text)`
  margin: 34px 0 25px;
`
const SupportText = styled(Link)`
  margin: 52px 0 12px;
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
      <TimeoutText size='20px' weight={500}>
        <FormattedMessage
          id='modals.lockboxsetup.connectdevice.timeout.header'
          defaultMessage='Are you still there?'
        />
      </TimeoutText>
      <Text size='12px' weight={300}>
        <FormattedHTMLMessage
          id='modals.lockboxsetup.connectdevice.timeout.trouble'
          defaultMessage="Looks like you're having trouble setting up your {deviceType}."
          values={{ deviceType }}
        />
      </Text>
      <Text size='12px' weight={300}>
        <FormattedMessage
          id='modals.lockboxsetup.connectdevice.timeout.assistance'
          defaultMessage='Please contact support for assistance or try again.'
        />
      </Text>
      <SupportText href={supportLink} target='_blank' size='10px' weight={400}>
        <FormattedMessage
          id='modals.lockboxsetup.connectdevice.timeout.support'
          defaultMessage='Contact Support'
        />
      </SupportText>
      <Button fullwidth onClick={onTimeoutAccept} nature={'primary'}>
        <FormattedMessage
          id='modals.lockboxsetup.connectdevice.timeout.retry'
          defaultMessage='Retry'
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
        <React.Fragment>
          <Row>
            <Text size='14px' weight={600}>
              <FormattedHTMLMessage
                id='modals.lockboxsetup.connectdevice.new.one'
                defaultMessage='1.'
              />
            </Text>
            <Text size='13px' weight={300}>
              <FormattedHTMLMessage
                id='modals.lockboxsetup.connectdevice.new.stepone'
                defaultMessage='Connect your {deviceType} to your computer with the supplied USB cable.'
                values={{ deviceType }}
              />
            </Text>
          </Row>
          <Row>
            <Text size='14px' weight={600}>
              <FormattedHTMLMessage
                id='modals.lockboxsetup.connectdevice.new.two'
                defaultMessage='2.'
              />
            </Text>
            <Text size='13px' weight={300}>
              <FormattedHTMLMessage
                id='modals.lockboxsetup.connectdevice.new.steptwo'
                defaultMessage='Press both buttons on the top of your {deviceType} to begin.'
                values={{ deviceType }}
              />
            </Text>
          </Row>
          <Row>
            <Text size='14px' weight={600}>
              <FormattedHTMLMessage
                id='modals.lockboxsetup.connectdevice.new.three'
                defaultMessage='3.'
              />
            </Text>
            <Text size='13px' weight={300}>
              <FormattedHTMLMessage
                id='modals.lockboxsetup.connectdevice.new.stepthree'
                defaultMessage='Set a pin for your device.'
              />
            </Text>
          </Row>
          <Row>
            <Text size='14px' weight={600}>
              <FormattedHTMLMessage
                id='modals.lockboxsetup.connectdevice.new.four'
                defaultMessage='4.'
              />
            </Text>
            <Text size='13px' weight={300}>
              <FormattedHTMLMessage
                id='modals.lockboxsetup.connectdevice.new.stepfour'
                defaultMessage='Complete backup phrase process.'
              />
            </Text>
          </Row>
          <Row>
            <Text size='14px' weight={600}>
              <FormattedHTMLMessage
                id='modals.lockboxsetup.connectdevice.new.five'
                defaultMessage='5.'
              />
            </Text>
            <Text size='13px' weight={300}>
              <FormattedHTMLMessage
                id='modals.lockboxsetup.connectdevice.new.stepfive'
                defaultMessage="Ensure your device's dashboard is open. Hint: You should see the settings icon."
              />
            </Text>
          </Row>
        </React.Fragment>
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
          nature='primary'
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
