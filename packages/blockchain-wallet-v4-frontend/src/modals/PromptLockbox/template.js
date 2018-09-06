import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl'

import {
  Icon,
  Modal,
  ModalHeader,
  ModalBody,
  Text
} from 'blockchain-info-components'

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`

const PromptLockbox = props => {
  const { position, total, close, ...rest } = props
  const { coin, currentConnection } = rest
  const { ready } = currentConnection

  return (
    <Modal size='medium' position={position} total={total} closeButton={false}>
      <ModalHeader icon='safe' onClose={close}>
        <FormattedMessage
          id='modals.promptforlockbox.title'
          defaultMessage='Connect {coin} App'
          values={{ coin }}
        />
      </ModalHeader>
      <ModalBody>
        <Row>
          <Text weight={300}>
            <FormattedHTMLMessage
              id='modals.promptforlockbox.connectapp'
              defaultMessage='1. Open the <b>{coin} app</b> on your device'
              values={{ coin }}
            />
          </Text>
          {ready ? (
            <Icon
              name='checkmark-in-circle-filled'
              size='24px'
              color='success'
            />
          ) : (
            <Icon name='refresh' />
          )}
        </Row>
        <Row>
          <Text weight={300} opacity={ready ? 1 : 0.4}>
            <FormattedMessage
              id='modals.promptforlockbox.confirmtx'
              defaultMessage='2. Review the transaction details on your device screen. Press the top right button to confirm the transaction.'
            />
          </Text>
        </Row>
      </ModalBody>
    </Modal>
  )
}

PromptLockbox.propTypes = {
  coin: PropTypes.string
}

export default PromptLockbox
