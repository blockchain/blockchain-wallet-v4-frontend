import React from 'react'
import styled from 'styled-components'
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl'

import { Button, Modal, ModalBody, Text } from 'blockchain-info-components'
import { RotateSync } from 'components/RotateSync'

const Wrapper = styled(ModalBody)`
  padding: 20px;
`
const Title = styled(Text)`
  text-align: center;
`
const Content = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 26px;
`
const Row = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 5px 0;
`
const InstallStatusRows = styled.div`
  margin-top: 8px;
  width: 100%;
  & > :last-child {
    margin: 8px 0;
  }
`
const ContinueButton = styled(Button)`
  & > :last-child {
    margin-left: 15px;
  }
`
const ButtonContainer = styled.div`
  width: 100%;
  margin-top: 30px;
`
const Instructions = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 15px;
`
const LockboxAppInstall = props => {
  const {
    closeAll,
    children,
    isOnDashboard,
    isInstallStep,
    onContinue,
    overallStatus
  } = props

  return (
    <Modal size='large' position={props.position} total={props.total}>
      <Wrapper>
        <Title size='20px' weight={400}>
          <FormattedMessage
            id='modals.lockboxappinstall.title'
            defaultMessage='Install/Update Lockbox Applications'
          />
        </Title>
        <Content>
          {!isInstallStep && (
            <React.Fragment>
              <Text size='16px' weight={300}>
                <FormattedHTMLMessage
                  id='modals.lockboxappinstall.connectdevice'
                  defaultMessage='Plug in device, unlock and open the dashboard on your device'
                />
              </Text>
              <ButtonContainer>
                <ContinueButton
                  fullwidth
                  disabled={!isOnDashboard}
                  onClick={onContinue}
                  nature={isOnDashboard ? 'success' : 'dark'}
                >
                  {isOnDashboard ? (
                    <FormattedMessage
                      id='modals.lockboxsetup.connectdevice.success'
                      defaultMessage='Success! Click to Continue'
                    />
                  ) : (
                    <FormattedMessage
                      id='modals.lockboxsetup.connectdevice.connect'
                      defaultMessage='Connect Your Lockbox'
                    />
                  )}
                  {!isOnDashboard && <RotateSync size='16px' color='white' />}
                </ContinueButton>
              </ButtonContainer>
            </React.Fragment>
          )}
          {isInstallStep && (
            <InstallStatusRows>
              <Instructions>
                <Text size='15px' weight={300}>
                  <FormattedHTMLMessage
                    id='modals.lockboxappinstall.allowmanager'
                    defaultMessage='Allow the device manager onto the device when prompted.'
                  />
                </Text>
                <Text size='15px' weight={300}>
                  <FormattedHTMLMessage
                    id='modals.lockboxappinstall.dontpress'
                    defaultMessage='Do not press any buttons on device until all installations are complete!'
                  />
                </Text>
              </Instructions>
              <Row>
                <Text size='16px' weight={400}>
                  <FormattedHTMLMessage
                    id='modals.lockboxappinstall.application'
                    defaultMessage='Application'
                  />
                </Text>
                <Text size='16px' weight={400}>
                  <FormattedHTMLMessage
                    id='modals.lockboxappinstall.status'
                    defaultMessage='Status'
                  />
                </Text>
              </Row>
              {children}
              <Row>
                <Button
                  onClick={closeAll}
                  fullwidth
                  nature='primary'
                  disabled={overallStatus.busy}
                >
                  <FormattedMessage
                    id='modals.lockboxappinstall.finish'
                    defaultMessage='Continue'
                  />
                </Button>
              </Row>
            </InstallStatusRows>
          )}
        </Content>
      </Wrapper>
    </Modal>
  )
}

export default LockboxAppInstall
