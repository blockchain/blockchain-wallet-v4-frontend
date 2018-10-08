import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { RotateSync } from 'components/RotateSync'
import { Button, Text } from 'blockchain-info-components'

const Title = styled.div`
  text-align: center;
  margin-bottom: 24px;
`
const Content = styled.div`
  text-align: center;
  max-width: 400px;
  margin: 10px auto;
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
        <Text size='22px' weight={400}>
          <FormattedMessage
            id='modals.lockboxfirmware.checkversionsstep.title'
            defaultMessage='Check for Updates'
          />
        </Text>
      </Title>
      <Content>
        {status === 'updateAvailable' ? (
          <Text size='15px' weight={300}>
            <FormattedMessage
              id='modals.lockboxfirmware.checkversionsstep.updateavailable'
              defaultMessage='A new firmware is available for your device! Click continue to start installing.'
            />
          </Text>
        ) : (
          <Text size='15px' weight={300}>
            <FormattedMessage
              id='modals.lockboxfirmware.checkversionsstep.subtitle'
              defaultMessage='Please wait while we check for updates for your device.'
            />
          </Text>
        )}
      </Content>
      <ButtonContainer>
        {status === 'updateAvailable' ? (
          <Button fullwidth nature='success' onClick={onStartInstall}>
            <FormattedMessage
              id='modals.lockboxfirmware.checkversionsstep.continue'
              defaultMessage='Continue'
            />
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
