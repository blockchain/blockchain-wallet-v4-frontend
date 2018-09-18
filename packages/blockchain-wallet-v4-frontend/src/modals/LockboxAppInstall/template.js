import React from 'react'
import styled from 'styled-components'
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl'

import {
  Button,
  Icon,
  Modal,
  ModalBody,
  FlatLoader,
  Text
} from 'blockchain-info-components'

const Wrapper = styled(ModalBody)`
  padding: 20px;
`
const Title = styled(Text)`
  text-align: center;
  margin-bottom: 20px;
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
const InstallStatus = styled.div`
  margin-top: 15px;
  width: 100%;
  & > :last-child {
    margin-top: 15px;
  }
`

const LockboxAppInstall = props => {
  const {
    btcBusy,
    ethBusy,
    bchBusy,
    closeAll,
    isOnDashboard,
    overallBusy
  } = props

  return (
    <Modal size='large' position={props.position} total={props.total}>
      <Wrapper>
        <Title size='17px' weight={400}>
          <FormattedMessage
            id='modals.lockboxappinstall.title'
            defaultMessage='Installing Lockbox Applications'
          />
        </Title>
        <Content>
          <Row>
            <Text size='14px' weight={300} style={{ marginRight: '30px' }}>
              <FormattedHTMLMessage
                id='modals.lockboxappinstall.subtitle'
                defaultMessage='Plug in device, open dashboard and allow device manager if prompted'
              />
            </Text>
            {isOnDashboard ? (
              <Icon
                name='checkmark-in-circle-filled'
                size='28px'
                color='success'
              />
            ) : (
              <FlatLoader width='80px' height='16px' />
            )}
          </Row>
          {isOnDashboard && (
            <InstallStatus>
              <Row>
                <Text size='14px' weight={400}>
                  <FormattedHTMLMessage
                    id='modals.lockboxappinstall.application'
                    defaultMessage='Application'
                  />
                </Text>
                <Text size='14px' weight={400}>
                  <FormattedHTMLMessage
                    id='modals.lockboxappinstall.status'
                    defaultMessage='Status'
                  />
                </Text>
              </Row>
              <Row>
                <Text size='14px' weight={300}>
                  <FormattedHTMLMessage
                    id='modals.lockboxappinstall.btc'
                    defaultMessage='Bitcoin'
                  />
                </Text>
                {btcBusy ? (
                  <FlatLoader width='80px' height='16px' />
                ) : (
                  <Icon
                    name='checkmark-in-circle-filled'
                    size='22px'
                    color='success'
                  />
                )}
              </Row>
              <Row>
                <Text size='14px' weight={300}>
                  <FormattedHTMLMessage
                    id='modals.lockboxappinstall.bch'
                    defaultMessage='Bitcoin Cash'
                  />
                </Text>
                {bchBusy ? (
                  <FlatLoader width='80px' height='16px' />
                ) : (
                  <Icon
                    name='checkmark-in-circle-filled'
                    size='22px'
                    color='success'
                  />
                )}
              </Row>
              <Row>
                <Text size='14px' weight={300}>
                  <FormattedHTMLMessage
                    id='modals.lockboxappinstall.eth'
                    defaultMessage='Ethereum'
                  />
                </Text>
                {ethBusy ? (
                  <FlatLoader width='80px' height='16px' />
                ) : (
                  <Icon
                    name='checkmark-in-circle-filled'
                    size='22px'
                    color='success'
                  />
                )}
              </Row>
              <Row>
                <Button
                  onClick={closeAll}
                  fullwidth
                  nature='primary'
                  disabled={overallBusy}
                >
                  <FormattedMessage
                    id='modals.lockboxappinstall.finish'
                    defaultMessage='Continue'
                  />
                </Button>
              </Row>
            </InstallStatus>
          )}
        </Content>
      </Wrapper>
    </Modal>
  )
}

export default LockboxAppInstall
