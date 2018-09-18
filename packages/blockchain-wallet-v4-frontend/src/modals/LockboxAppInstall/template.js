import React from 'react'
import styled from 'styled-components'
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl'

import {
  Button,
  Icon,
  Modal,
  ModalBody,
  Text
} from 'blockchain-info-components'
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
const Result = styled.div`
  display: flex;
  & > :last-child {
    margin-left: 5px;
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
const RotateSyncIcon = styled(RotateSync)`
  margin-right: 18px;
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
    btcStatus,
    ethStatus,
    bchStatus,
    closeAll,
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
                  nature={isOnDashboard ? 'success' : 'gray'}
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
              <Row>
                <Text size='16px' weight={300}>
                  <FormattedHTMLMessage
                    id='modals.lockboxappinstall.btc'
                    defaultMessage='Bitcoin'
                  />
                </Text>
                {btcStatus.waiting && (
                  <Text size='14px' weight={300}>
                    <FormattedHTMLMessage
                      id='modals.lockboxappinstall.pending'
                      defaultMessage='Pending'
                    />
                  </Text>
                )}
                {btcStatus.busy && <RotateSyncIcon size='15px' />}
                {btcStatus.error && (
                  <Result>
                    <Icon
                      name='alert-filled'
                      size='18px'
                      color='brand-yellow'
                    />
                    <Text size='14px' weight={300}>
                      {btcStatus.error()}
                    </Text>
                  </Result>
                )}
                {btcStatus.success && (
                  <Result>
                    <Icon
                      name='checkmark-in-circle-filled'
                      size='18px'
                      color='success'
                    />
                    <Text size='14px' weight={300}>
                      <FormattedHTMLMessage
                        id='modals.lockboxappinstall.success'
                        defaultMessage='Success!'
                      />
                    </Text>
                  </Result>
                )}
              </Row>
              <Row>
                <Text size='16px' weight={300}>
                  <FormattedHTMLMessage
                    id='modals.lockboxappinstall.bch'
                    defaultMessage='Bitcoin Cash'
                  />
                </Text>
                {bchStatus.waiting && (
                  <Text size='14px' weight={300}>
                    <FormattedHTMLMessage
                      id='modals.lockboxappinstall.pending'
                      defaultMessage='Pending'
                    />
                  </Text>
                )}
                {bchStatus.busy && <RotateSyncIcon size='15px' />}
                {bchStatus.error && (
                  <Result>
                    <Icon
                      name='alert-filled'
                      size='18px'
                      color='brand-yellow'
                    />
                    <Text size='14px' weight={300}>
                      {bchStatus.error()}
                    </Text>
                  </Result>
                )}
                {bchStatus.success && (
                  <Result>
                    <Icon
                      name='checkmark-in-circle-filled'
                      size='18px'
                      color='success'
                    />
                    <Text size='14px' weight={300}>
                      <FormattedHTMLMessage
                        id='modals.lockboxappinstall.success'
                        defaultMessage='Success!'
                      />
                    </Text>
                  </Result>
                )}
              </Row>
              <Row>
                <Text size='16px' weight={300}>
                  <FormattedHTMLMessage
                    id='modals.lockboxappinstall.eth'
                    defaultMessage='Ethereum'
                  />
                </Text>
                {ethStatus.waiting && (
                  <Text size='14px' weight={300}>
                    <FormattedHTMLMessage
                      id='modals.lockboxappinstall.pending'
                      defaultMessage='Pending'
                    />
                  </Text>
                )}
                {ethStatus.busy && <RotateSyncIcon size='15px' />}
                {ethStatus.error && (
                  <Result>
                    <Icon
                      name='alert-filled'
                      size='18px'
                      color='brand-yellow'
                    />
                    <Text size='14px' weight={300}>
                      {ethStatus.error()}
                    </Text>
                  </Result>
                )}
                {ethStatus.success && (
                  <Result>
                    <Icon
                      name='checkmark-in-circle-filled'
                      size='18px'
                      color='success'
                    />
                    <Text size='14px' weight={300}>
                      <FormattedHTMLMessage
                        id='modals.lockboxappinstall.success'
                        defaultMessage='Success!'
                      />
                    </Text>
                  </Result>
                )}
              </Row>
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
