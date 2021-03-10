import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Button, Image, Text, TextGroup } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
`
const DeviceWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 175px;
  width: 100%;
`
const NewButton = styled(Button)`
  position: relative;
  height: 55px;
  margin: 30px 0 12px;
`
const ExistingButton = styled(Button)`
  height: 55px;
`

const SetupTypeStep = props => {
  const { deviceType, handleStepChange } = props
  return (
    <Wrapper>
      {deviceType === 'Lockbox' ? (
        <DeviceWrapper>
          <Image
            width='60%'
            name='lockbox-device'
            srcset={{ 'lockbox-device': '1x' }}
          />
          <Text size='16px' weight={500} style={{ marginTop: '20px' }}>
            <FormattedMessage
              id='modals.lockboxsetup.setuptypestep.connectlockbox'
              defaultMessage='Connect your Blockchain Lockbox'
            />
          </Text>
        </DeviceWrapper>
      ) : (
        <DeviceWrapper>
          <Image
            width='55%'
            name='ledger-nano-s'
            srcset={{ 'ledger-nano-s': '1x' }}
          />
          <Text size='16px' weight={500} style={{ marginTop: '24px' }}>
            <FormattedMessage
              id='modals.lockboxsetup.setuptypestep.connectnanos'
              defaultMessage='Connect your Ledger Nano S'
            />
          </Text>
        </DeviceWrapper>
      )}
      <NewButton
        nature='primary'
        fullwidth
        onClick={() => handleStepChange('new')}
      >
        <TextGroup>
          <Text size='14px' weight={400} color='white'>
            <FormattedMessage
              id='modals.lockboxsetup.setuptypestep.new'
              defaultMessage='Set up new device'
            />
          </Text>
          <Text size='10px' weight={400} color='white'>
            <FormattedMessage
              id='modals.lockboxsetup.setuptypestep.newlength'
              defaultMessage='10-15 Minutes'
            />
          </Text>
        </TextGroup>
      </NewButton>
      <ExistingButton
        nature='received'
        fullwidth
        onClick={() => handleStepChange('existing')}
      >
        <TextGroup>
          <Text size='14px' weight={400} color='white'>
            <FormattedMessage
              id='modals.lockboxsetup.setuptypestep.existing'
              defaultMessage='Sign in with PIN'
            />
          </Text>
          <Text size='10px' weight={400} color='white'>
            <FormattedMessage
              id='modals.lockboxsetup.setuptypestep.existinglength'
              defaultMessage='2-3 Minutes'
            />
          </Text>
        </TextGroup>
      </ExistingButton>
    </Wrapper>
  )
}

export default SetupTypeStep
