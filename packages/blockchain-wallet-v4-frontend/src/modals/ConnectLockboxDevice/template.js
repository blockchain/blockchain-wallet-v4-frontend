import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import {
  FlatLoader,
  TextGroup,
  Text,
  Modal,
  ModalHeader,
  ModalBody
} from 'blockchain-info-components'

const LoaderContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 25px;
`

const determineApp = app => {
  switch (app) {
    case 'BTC':
      return 'Bitcoin'
    case 'BCH':
      return 'Bitcoin Cash'
    case 'ETH':
      return 'Ethereum'
    default:
      return 'Dashboard'
  }
}

const Loading = props => {
  const { app } = props

  return (
    <Modal size='large' position={props.position} total={props.total}>
      <ModalHeader icon='lock' onClose={props.closeAll}>
        <FormattedMessage
          id='modals.connectlockbox.title'
          defaultMessage='Connect your device'
        />
      </ModalHeader>
      <ModalBody>
        <TextGroup>
          <Text size='14px' weight={300}>
            <FormattedMessage
              id='modals.connectlockbox.connectdevice'
              defaultMessage='1. Connect your lockbox to computer via USB port.'
            />
          </Text>
          <Text size='14px' weight={300}>
            <FormattedMessage
              id='modals.connectlockbox.openapp'
              defaultMessage='2. Open the {appName} application'
              values={{ appName: determineApp(app) }}
            />
          </Text>
          <Text size='14px' weight={300}>
            <FormattedMessage
              id='modals.connectlockbox.enablebrowsersupport'
              defaultMessage='3. Make sure browser support is enabled'
            />
          </Text>
        </TextGroup>
        <LoaderContainer>
          <FlatLoader width='150px' height='25px' />
        </LoaderContainer>
      </ModalBody>
    </Modal>
  )
}

export default Loading
