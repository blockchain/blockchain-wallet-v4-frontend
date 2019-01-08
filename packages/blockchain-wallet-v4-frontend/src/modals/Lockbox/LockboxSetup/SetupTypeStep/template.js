import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

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
  width: 175px;
`
const NewButton = styled(Button)`
  height: 55px;
  margin: 30px 0 6px;
`
const ExistingButton = styled(Button)`
  height: 55px;
`

const SetupTypeStep = props => {
  const { handleStepChange, deviceType } = props
  return (
    <Wrapper>
      {deviceType === 'Lockbox' ? (
        <DeviceWrapper>
          <Image
            width='65%'
            name='firmware-connect'
            srcset={{ 'ledger-lockbox': '1x' }}
          />
          <Text size='20px' weight={400} style={{ marginTop: '14px' }}>
            <FormattedMessage
              id='modals.lockboxsetup.setuptypestep.lockbox'
              defaultMessage='Lockbox'
            />
          </Text>
          <Text size='14px' weight={300}>
            <FormattedMessage
              id='modals.lockboxsetup.setuptypestep.blockchain'
              defaultMessage='Blockchain'
            />
          </Text>
        </DeviceWrapper>
      ) : (
        <DeviceWrapper>
          <Image
            width='65%'
            name='firmware-connect'
            srcset={{ 'ledger-lockbox': '1x' }}
          />
          <Text size='20px' weight={400} style={{ marginTop: '14px' }}>
            <FormattedMessage
              id='modals.lockboxsetup.setuptypestep.nanos'
              defaultMessage='Nano S'
            />
          </Text>
          <Text size='14px' weight={300}>
            <FormattedMessage
              id='modals.lockboxsetup.setuptypestep.ledger'
              defaultMessage='Ledger'
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
          <Text size='13px' weight={300} color='white'>
            <FormattedMessage
              id='modals.lockboxsetup.setuptypestep.new'
              defaultMessage='Setup A New Device'
            />
          </Text>
          <Text size='11px' weight={300} color='white'>
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
          <Text size='13px' weight={300} color='white'>
            <FormattedMessage
              id='modals.lockboxsetup.setuptypestep.existing'
              defaultMessage='Sign In With PIN'
            />
          </Text>
          <Text size='11px' weight={300} color='white'>
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
