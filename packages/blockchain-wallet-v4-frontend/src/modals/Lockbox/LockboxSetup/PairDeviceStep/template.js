import React from 'react'
import styled from 'styled-components'
import { FormattedHTMLMessage } from 'react-intl'
import { RotateSync } from 'components/RotateSync'
import { Button, Image, Text, TextGroup } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
`
const IntroText = styled(Text)`
  margin: 20px 0 30px;
`
const InstallReminderText = styled(Text)`
  margin: 20px 0 40px;
`
const ClickableText = styled(Text)`
  color: ${props => props.theme['brand-secondary']};
  cursor: pointer;
`
const PairDeviceStep = props => {
  const { deviceType, isReady, onStepChange } = props

  return (
    <Wrapper>
      <Image
        name='lockbox-onboard-name'
        width='100%'
        srcset={{ 'lockbox-onboard-name': '1x' }}
      />
      <IntroText size='13px' weight={300}>
        <FormattedHTMLMessage
          id='modals.lockboxsetup.pairdevice.intro'
          defaultMessage='Open the Bitcoin app on your {deviceType}. This will pair your device with your Blockchain wallet so that you can always view the balance of your Lockbox.'
          values={{ deviceType }}
        />
      </IntroText>
      <TextGroup inline style={{ marginBottom: '10px' }}>
        <InstallReminderText size='11px' weight={300}>
          <FormattedHTMLMessage
            id='modals.lockboxsetup.pairdevice.install'
            defaultMessage="Don't have the Bitcoin app on your {deviceType}? Install it"
            values={{ deviceType }}
          />
        </InstallReminderText>
        <ClickableText size='11px' weight={300}>
          <FormattedHTMLMessage
            id='modals.lockboxsetup.pairdevice.here'
            defaultMessage='here.'
          />
        </ClickableText>
      </TextGroup>
      <Button
        fullwidth
        disabled={!isReady}
        nature={isReady ? 'primary' : 'dark'}
        onClick={onStepChange}
      >
        {isReady ? (
          <FormattedHTMLMessage
            id='modals.lockboxsetup.openbtcappstep.success'
            defaultMessage='Success! Click to Continue'
          />
        ) : (
          <FormattedHTMLMessage
            id='modals.lockboxsetup.openbtcappstep.waiting'
            defaultMessage='Waiting...'
          />
        )}
      </Button>
    </Wrapper>
  )
}

export default PairDeviceStep
