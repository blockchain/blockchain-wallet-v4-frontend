import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Link, Icon, Image, Text } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`
const IntroText = styled(Text)`
  margin-bottom: 20px;
  text-align: center;
`
const SelectDeviceWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
`
const DeviceWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 150px;
  width: 160px;
  border: 1px solid ${props => props.theme['gray-2']};
  border-radius: 3px;
  &:hover {
    cursor: pointer;
    border-color: ${props => props.theme['brand-tertiary']};
    box-shadow: 0 0 2px 0 ${props => props.theme['brand-secondary']} inset;
  }
`
const RestoreDeviceWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  margin-top: 18px;
  padding: 14px 12px;
  box-sizing: border-box;
  border-radius: 3px;
  background-color: ${props => props.theme['white-blue']};
  &:hover {
    cursor: pointer;
    border-color: ${props => props.theme['brand-tertiary']};
    box-shadow: 0 0 2px 0 ${props => props.theme['brand-secondary']} inset;
  }
`
const LearnHowLink = styled(Link)`
  display: inline-flex;
`
const LearnHowText = styled(Text)`
  margin-right: 6px;
  color: ${props => props.theme['brand-secondary']};
`

const DeviceSelectStep = props => {
  const { handleStepChange } = props
  return (
    <Wrapper>
      <IntroText size='14px' weight={300}>
        <FormattedMessage
          id='modals.lockboxsetup.deviceselect.intro'
          defaultMessage='Your Blockchain wallet works with Lockbox and Ledger Nano S devices.'
        />
      </IntroText>
      <SelectDeviceWrapper>
        <DeviceWrapper onClick={() => handleStepChange('blockchain')}>
          <Image
            width='50%'
            name='firmware-connect'
            srcset={{ 'ledger-lockbox': '1x' }}
          />
          <Text size='14px' weight={400} style={{ marginTop: '5px' }}>
            <FormattedMessage
              id='modals.lockboxsetup.deviceselect.lockbox'
              defaultMessage='Lockbox'
            />
          </Text>
          <Text size='12px' weight={300}>
            <FormattedMessage
              id='modals.lockboxsetup.deviceselect.blockchain'
              defaultMessage='Blockchain'
            />
          </Text>
        </DeviceWrapper>
        <DeviceWrapper onClick={() => handleStepChange('ledger')}>
          <Image
            width='50%'
            name='firmware-connect'
            srcset={{ 'ledger-lockbox': '1x' }}
          />
          <Text size='14px' weight={400} style={{ marginTop: '5px' }}>
            <FormattedMessage
              id='modals.lockboxsetup.deviceselect.nanos'
              defaultMessage='Nano S'
            />
          </Text>
          <Text size='12px' weight={300}>
            <FormattedMessage
              id='modals.lockboxsetup.deviceselect.ledger'
              defaultMessage='Ledger'
            />
          </Text>
        </DeviceWrapper>
      </SelectDeviceWrapper>
      <RestoreDeviceWrapper>
        <Text size='15px'>
          <FormattedMessage
            id='modals.lockboxsetup.deviceselect.restore'
            defaultMessage='Restore a device'
          />
        </Text>
        <LearnHowLink href={'/lockbox'} target='_blank'>
          <LearnHowText size='14px'>
            <FormattedMessage
              id='modals.lockboxsetup.deviceselect.learhow'
              defaultMessage='Learn How'
            />
          </LearnHowText>
          <Icon name='short-right-arrow' color='brand-secondary' size='18px' />
        </LearnHowLink>
      </RestoreDeviceWrapper>
    </Wrapper>
  )
}

export default DeviceSelectStep
