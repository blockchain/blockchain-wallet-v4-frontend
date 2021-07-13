import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Button, Image, Text } from 'blockchain-info-components'

import { RotateSync } from '../../components/RotateSync'

const Title = styled.div`
  text-align: center;
  margin-bottom: 20px;
`
const Content = styled.div`
  text-align: center;
  margin-bottom: 20px;
`
const ButtonContainer = styled.div`
  margin-top: 15px;
`
const RotateSyncContainer = styled(RotateSync)`
  margin-left: 15px;
`

const CheckForUpdatesStep = props => {
  return (
    <React.Fragment>
      <Title>
        <Text>
          <FormattedMessage
            id='modals.lockboxfirmware.connectdevice.title'
            defaultMessage='Connect your Lockbox'
          />
        </Text>
      </Title>
      <Content>
        <Text color='grey500' weight={400}>
          <FormattedMessage
            id='modals.lockboxfirmware.connectdevice.subtitle'
            defaultMessage='Connect and unlock your Lockbox. Then open the Dashboard app.'
          />
        </Text>
      </Content>
      <Image
        width='100%'
        name='firmware-connect'
        srcset={{
          'firmware-connect2': '2x',
          'firmware-connect3': '3x'
        }}
      />
      <ButtonContainer>
        <Button disabled fullwidth nature='dark'>
          <FormattedMessage
            id='modals.lockboxfirmware.connectdevice.loading'
            defaultMessage='Connect Your Lockbox'
          />
          <RotateSyncContainer size='16px' color='white' />
        </Button>
      </ButtonContainer>
    </React.Fragment>
  )
}

export default CheckForUpdatesStep
