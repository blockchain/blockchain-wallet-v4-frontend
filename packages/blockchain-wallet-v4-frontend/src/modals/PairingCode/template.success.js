import React from 'react'
import styled from 'styled-components'
import QRCodeReact from 'qrcode.react'
import { FormattedMessage } from 'react-intl'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'blockchain-info-components'

const QRCodeContainer = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;
  width: 100;
  padding: 30px 0;
`

const PairingCode = (props) => {
  const { val, position, total, close, closeAll } = props

  return (
    <Modal size='large' position={position} total={total}>
      <ModalHeader icon='request' onClose={closeAll}>
        <FormattedMessage id='modals.pairingcode.title' defaultMessage='Pairing code' />
      </ModalHeader>
      <ModalBody>
        <FormattedMessage id='modals.pairingcode.scan' defaultMessage='Scan Pairing Code' />
        <QRCodeContainer>
          <QRCodeReact value={val} size={256} />
        </QRCodeContainer>
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
