import React from 'react'
import styled from 'styled-components'
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl'

import {
  Button,
  BlockchainLoader,
  Image,
  Modal,
  ModalBody,
  ModalHeader,
  Text,
  TextGroup
} from 'blockchain-info-components'

const ConnectStep = styled.div`
  text-align: center;
  & > :last-child {
    margin: 10px 0;
  }
`
const ConnectSubtitle = styled(Text)`
  text-align: center;
  padding: 5px;
  margin-bottom: 10px;
`
const ContentWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`
const CloseButton = styled(Button)`
  margin: 16px 4px 0;
`
const Loader = styled(BlockchainLoader)`
  margin: 40px 0;
`

const AuthenticityStep = props => {
  const { authenticity, connection, position, onClose, total } = props
  const { isAuthenticating, isAuthentic } = authenticity

  return (
    <Modal size='small' position={position} total={total}>
      <ModalHeader onClose={onClose}>
        <FormattedMessage
          id='modals.lockbox.authenticity.title'
          defaultMessage='Authenticate Device'
        />
      </ModalHeader>
      <ModalBody>
        {connection.app !== 'DASHBOARD' ? (
          <ConnectStep>
            <ConnectSubtitle size='16px' weight={400} color='gray-4'>
              <FormattedHTMLMessage
                id='modals.lockbox.appmanager.connectdevice'
                defaultMessage='Connect, unlock and open the Dashboard on your Lockbox device now.'
              />
            </ConnectSubtitle>
            <Image
              width='330px'
              name='lockbox-send-connect'
              srcset={{
                'lockbox-send-connect2': '2x',
                'lockbox-send-connect3': '3x'
              }}
            />
          </ConnectStep>
        ) : isAuthenticating ? (
          <ContentWrapper>
            <Text size='16px'>
              <FormattedHTMLMessage
                id='modals.lockbox.authenticity.content'
                defaultMessage="Verifying your device's authenticity"
              />
              &hellip;
            </Text>
            <Loader width='100px' height='100px' />
            <TextGroup inline>
              <Text size='14px' weight={400}>
                <FormattedMessage
                  id='modals.lockbox.authenticity.note'
                  defaultMessage='Note:'
                />
              </Text>
              <Text size='14px' weight={300}>
                <FormattedMessage
                  id='modals.lockbox.authenticity.notetext'
                  defaultMessage='Allow the device manager onto the device if prompted.'
                />
              </Text>
            </TextGroup>
          </ContentWrapper>
        ) : (
          <ContentWrapper>
            {isAuthentic ? (
              <React.Fragment>
                <Text size='18px' style={{ marginBottom: '5px' }}>
                  <FormattedHTMLMessage
                    id='modals.lockbox.authenticity.success1'
                    defaultMessage='Congratulations!'
                  />
                </Text>
                <Text size='16px' style={{ marginBottom: '16px' }}>
                  <FormattedHTMLMessage
                    id='modals.lockbox.authenticity.success2'
                    defaultMessage='Your device appears to be genuine!'
                  />
                </Text>
                <Image
                  name='lockbox-success'
                  width='340px'
                  srcset={{
                    'lockbox-success2': '2x',
                    'lockbox-success3': '3x'
                  }}
                />
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Text size='16px' style={{ marginBottom: '16px' }}>
                  <FormattedHTMLMessage
                    id='modals.lockbox.authenticity.failed'
                    defaultMessage='Your device does not appear to be genuine. Please reach out to our support team before using this device.'
                  />
                </Text>
                <Image
                  name='lockbox-failed'
                  width='340px'
                  srcset={{
                    'lockbox-failed2': '2x',
                    'lockbox-failed3': '3x'
                  }}
                />
              </React.Fragment>
            )}
            <CloseButton onClick={onClose} nature='primary' fullwidth>
              <FormattedHTMLMessage
                id='modals.lockbox.authenticity.close'
                defaultMessage='Close'
              />
            </CloseButton>
          </ContentWrapper>
        )}
      </ModalBody>
    </Modal>
  )
}

export default AuthenticityStep
