import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'blockchain-info-components'

const PairingCode = (props) => {
  const { position, total, close, closeAll } = props

  return (
    <Modal size='large' position={position} total={total}>
      <ModalHeader icon='request' onClose={closeAll}>
        <FormattedMessage id='modals.pairingcode.title' defaultMessage='Pairing code' />
      </ModalHeader>
      <ModalBody>
        <FormattedMessage id='modals.pairingcode.scan' defaultMessage='Scan Pairing Code' />
        <div>Error</div>
      </ModalBody>
      <ModalFooter>
        <Button nature='primary' fullwidth onClick={close}>
          <FormattedMessage id='modals.pairingcode.close' defaultMessage='Close' />
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default PairingCode
