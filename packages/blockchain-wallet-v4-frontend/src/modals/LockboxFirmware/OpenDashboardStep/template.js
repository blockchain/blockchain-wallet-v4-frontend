import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import {
  Button,
  FlatLoader,
  Icon,
  Text,
  ModalBody
} from 'blockchain-info-components'

const Header = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 4px 0 10px;
  & > :last-child {
    margin-top: 6px;
  }
`
const Content = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`
const Row = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 12px 0;
`
const StepInstructions = styled(Text)`
  max-width: 325px;
`

const ConnectLockboxDevice = props => {
  const { connectionInfo, retryConnection } = props

  return (
    <React.Fragment>
      <ModalBody>
        <Header>
          <Text size='24px' weight={400}>
            <FormattedMessage
              id='modals.lockboxfirmware.opendashboardstep.title'
              defaultMessage='Connect your device'
            />
          </Text>
          <Text size='12px' weight={300}>
            <FormattedMessage
              id='modals.lockboxfirmware.opendashboardstep.subtitle'
              defaultMessage='Follow the steps below to continue'
            />
          </Text>
        </Header>
        <Content>
          <Row>
            <StepInstructions size='14px' weight={300}>
              <FormattedMessage
                id='modals.lockboxfirmware.opendashboardstep.connectdevice'
                defaultMessage='Connect, unlock and open the Dashboard on your Lockbox'
              />
            </StepInstructions>
            {connectionInfo.app ? (
              <Icon
                name='checkmark-in-circle-filled'
                size='24px'
                color='success'
              />
            ) : connectionInfo.error ? (
              <Icon name='alert' size='24px' color='error' />
            ) : (
              <FlatLoader width='50px' height='10px' />
            )}
          </Row>
          {connectionInfo.error && (
            <Row>
              <StepInstructions size='14px' weight={300} color={'error'}>
                <FormattedMessage
                  id='modals.lockboxfirmware.opendashboardstep.failtoconnect'
                  defaultMessage='Failed to connect to Lockbox device!'
                />
              </StepInstructions>
              <Button onClick={retryConnection} nature='primary'>
                <FormattedMessage
                  id='modals.lockboxfirmware.opendashboardstep.retry'
                  defaultMessage='Retry'
                />
              </Button>
            </Row>
          )}
        </Content>
      </ModalBody>
    </React.Fragment>
  )
}

export default ConnectLockboxDevice
