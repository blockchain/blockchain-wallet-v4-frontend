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
  const { isLoading, isSuccess } = props.authenticity

  const isReady = !isLoading && isSuccess
  const isFailure = !isLoading && !isSuccess

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
          <FormattedHTMLMessage
            id='modals.lockboxsetup.connectdevice.step1'
            defaultMessage='<span class=&quot;number&quot;>1.</span> Insert your Lockbox into your computer'
          />
        </StepText>
        <StepText size='16px' weight={300}>
          <FormattedHTMLMessage
            id='modals.lockboxsetup.connectdevice.step2'
            defaultMessage='<span class=&quot;number&quot;>2.</span> Press both buttons on your Lockbox to begin'
          />
        </StepText>
        <StepText size='16px' weight={300}>
          <FormattedHTMLMessage
            id='modals.lockboxsetup.connectdevice.step3'
            defaultMessage='<span class=&quot;number&quot;>3.</span> Set your pin'
          />
        </StepText>
        <StepText size='16px' weight={300}>
          <FormattedHTMLMessage
            id='modals.lockboxsetup.connectdevice.step4'
            defaultMessage='<span class=&quot;number&quot;>4.</span> Complete backup phrase process'
          />
        </StepText>
      </TextGroup>
      <ButtonContainer>
        {isReady ? (
          <Button
            nature='success'
            onClick={() => props.handleStepChange()}
            fullwidth
          >
            <FormattedMessage
              id='modals.lockboxsetup.connectdevice.success'
              defaultMessage='Success! Click to Continue'
            />
          </Button>
        ) : isFailure ? (
          <Button nature='gray' disabled fullwidth>
            <FormattedMessage
              id='modals.lockboxsetup.connectdevice.failure'
              defaultMessage='Error Authenticating Device. Contact Support'
            />
          </Button>
        ) : (
          <Button nature='gray' disabled={!isReady} fullwidth>
            {isLoading ? (
              <FormattedMessage
                id='modals.lockboxsetup.connectdevice.connect'
                defaultMessage='Connect Your Lockbox'
              />
            ) : (
              <FormattedMessage
                id='modals.lockboxsetup.connectdevice.loading'
                defaultMessage='Checking Device Authenticity'
              />
            )}
          </Button>
        )}
      </ButtonContainer>
    </Wrapper>
  )
}

export default ConnectDeviceStep
