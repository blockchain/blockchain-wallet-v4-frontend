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
  margin: 2px 0 14px;
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
const ContinueMessage = styled(Row)`
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin: 14px;
`
const StepInstructions = styled(Text)`
  max-width: 325px;
`

const CheckForUpdatesStep = props => {
  const { connection, firmwares, retryConnection, continueOrClose } = props

  return (
    <React.Fragment>
      <ModalBody>
        <Header>
          <Text size='24px' weight={400}>
            <FormattedMessage
              id='modals.lockboxfirmware.checkforupdates.title'
              defaultMessage='Update Lockbox Firmware'
            />
          </Text>
          <Text size='16px' weight={300}>
            <FormattedMessage
              id='modals.lockboxfirmware.checkforupdates.subtitle'
              defaultMessage='Follow the steps below to continue'
            />
          </Text>
        </Header>
        <Content>
          <Row>
            <StepInstructions size='14px' weight={400}>
              <FormattedMessage
                id='modals.lockboxfirmware.checkforupdates.connectdevice'
                defaultMessage='1) Connect and open the Dashboard on your Lockbox'
              />
            </StepInstructions>
            {connection.app ? (
              <Icon
                name='checkmark-in-circle-filled'
                size='24px'
                color='success'
              />
            ) : connection.error ? (
              <div>
                <Icon name='alert' size='24px' color='error' />
                <Button onClick={retryConnection} nature='primary'>
                  <FormattedMessage
                    id='modals.lockboxfirmware.checkforupdates.retry'
                    defaultMessage='Retry'
                  />
                </Button>
              </div>
            ) : (
              <FlatLoader width='50px' height='10px' />
            )}
          </Row>
          <Row>
            <StepInstructions size='14px' weight={400}>
              <FormattedMessage
                id='modals.lockboxfirmware.checkforupdates.installed'
                defaultMessage='2) Check device firmware version'
              />
            </StepInstructions>
            {firmwares && firmwares.installed ? (
              <Text size='14px' weight={300}>
                {firmwares.installed.seVersion}
              </Text>
            ) : (
              <FlatLoader width='50px' height='10px' />
            )}
          </Row>
          <Row>
            <StepInstructions size='14px' weight={400}>
              <FormattedMessage
                id='modals.lockboxfirmware.checkforupdates.latest'
                defaultMessage='3) Get latest firmware version'
              />
            </StepInstructions>
            {firmwares && firmwares.latest ? (
              <Text size='14px' weight={300}>
                {firmwares.latest.version}
              </Text>
            ) : (
              <FlatLoader width='50px' height='10px' />
            )}
          </Row>
          {connection.app &&
            firmwares &&
            firmwares.latest && (
              <ContinueMessage>
                {firmwares.latest.deviceOutdated ? (
                  <Text size='14px' weight={300} color='error'>
                    <FormattedMessage
                      id='modals.lockboxfirmware.checkforupdates.deviceoutdated'
                      defaultMessage='An update is available for your device!'
                    />
                  </Text>
                ) : (
                  <Text size='16px' weight={300} color='success'>
                    <FormattedMessage
                      id='modals.lockboxfirmware.checkforupdates.deviceuptodated'
                      defaultMessage='Congrats! Your device is up to date!'
                    />
                  </Text>
                )}
              </ContinueMessage>
            )}
          <Row>
            <Button
              nature='primary'
              fullwidth
              disabled={firmwares && !firmwares.latest}
              onClick={continueOrClose}
            >
              <FormattedMessage
                id='modals.lockboxfirmware.checkforupdates.continue'
                defaultMessage='Continue'
              />
            </Button>
          </Row>
        </Content>
      </ModalBody>
    </React.Fragment>
  )
}

export default CheckForUpdatesStep
