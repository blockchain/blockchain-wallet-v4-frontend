import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Modal, ModalHeader, ModalBody } from 'blockchain-info-components'

const SendBitcoin = props => (
  <Modal size='large' position={props.position} total={props.total}>
    <ModalHeader icon='send' onClose={props.closeAll}>
      <FormattedMessage id='modals.sendbitcoin.title' defaultMessage='Send Bitcoin' />
    </ModalHeader>
    <ModalBody>
      {props.children}
    </ModalBody>
  </Modal>
)

export default SendBitcoin
