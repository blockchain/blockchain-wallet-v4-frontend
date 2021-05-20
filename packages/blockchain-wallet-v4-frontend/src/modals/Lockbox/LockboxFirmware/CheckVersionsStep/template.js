import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { BlockchainLoader, Button, Text } from 'blockchain-info-components'

import { RotateSync } from '../../components/RotateSync'

const Title = styled.div`
  text-align: center;
  margin-bottom: 20px;
`
const Content = styled.div`
  text-align: center;
  margin-bottom: 40px;
`
const LoaderContainer = styled.div`
  margin: 60px;
  display: flex;
  justify-content: center;
`
const ButtonContainer = styled.div`
  margin-top: 50px;
`
const RotateSyncContainer = styled(RotateSync)`
  margin-left: 15px;
`
const CheckVersionsStep = props => {
  const { onStartInstall, status } = props
  return (
    <React.Fragment>
      <Title>
        <Text>
          <FormattedMessage
            id='modals.lockboxfirmware.checkversionsstep.title'
            defaultMessage='Checking for Updates'
          />
        </Text>
      </Title>
      <LoaderContainer>
        <BlockchainLoader width='80px' height='80px' />
      </LoaderContainer>
      <Content>
        {status ? (
          <Text weight={400}>
            <FormattedMessage
              id='modals.lockboxfirmware.checkversionsstep.updateavailable'
              defaultMessage='A new firmware, version {status}, is available for your device! Click continue to start installing.'
              values={{ status: <strong>{status}</strong> }}
            />
          </Text>
        ) : (
          <Text size='15px' weight={400}>
            <FormattedMessage
              id='modals.lockboxfirmware.checkversionsstep.subtitle'
              defaultMessage='Please wait while we check for updates for your device.'
            />
          </Text>
        )}
      </Content>
      <ButtonContainer>
        {status ? (
          <Button fullwidth nature='primary' onClick={onStartInstall}>
            Install Update
          </Button>
        ) : (
          <Button fullwidth disabled nature='dark'>
            <FormattedMessage
              id='modals.lockboxfirmware.checkversionsstep.loading'
              defaultMessage='Checking Versions'
            />
            <RotateSyncContainer size='16px' color='white' />
          </Button>
        )}
      </ButtonContainer>
    </React.Fragment>
  )
}

export default CheckVersionsStep
