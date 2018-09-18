import React from 'react'
import styled from 'styled-components'
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl'

import {
  Button,
  Icon,
  Modal,
  ModalBody,
  FlatLoader,
  Text,
  TextGroup
} from 'blockchain-info-components'

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
  padding: 10px 0;
`
const InstallStatusRows = styled.div`
  margin-top: 15px;
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
const LockboxAppInstall = props => {
  const {
    btcStatus,
    ethStatus,
    bchStatus,
    closeAll,
    isOnDashboard,
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
          {!isOnDashboard && (
            <React.Fragment>
              <Text
                size='16px'
                weight={300}
                style={{ marginBottom: '25px', textAlign: 'center' }}
              >
                <FormattedHTMLMessage
                  id='modals.lockboxappinstall.connectdevice'
                  defaultMessage='Plug in device, unlock and open the dashboard on your device'
                />
              </Text>
              <FlatLoader width='135px' height='30px' />
            </React.Fragment>
          )}
          {isOnDashboard && (
            <InstallStatusRows>
              <TextGroup>
                <Text size='14px' weight={300}>
                  <FormattedHTMLMessage
                    id='modals.lockboxappinstall.allowmanager'
                    defaultMessage='Allow the device manager onto the device when prompted.'
                  />
                </Text>

                <Text size='14px' weight={300}>
                  <FormattedHTMLMessage
                    id='modals.lockboxappinstall.dontpress'
                    defaultMessage='Do not press any buttons on device until all installations are complete!'
                  />
                </Text>
              </TextGroup>
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
                {btcStatus.busy && <FlatLoader width='60px' height='16px' />}
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
                {bchStatus.busy && <FlatLoader width='60px' height='16px' />}
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
                {ethStatus.busy && <FlatLoader width='60px' height='16px' />}
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
                {overallStatus.error && (
                  <Text size='14px' weight={300}>
                    {overallStatus.error}
                  </Text>
                )}
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
