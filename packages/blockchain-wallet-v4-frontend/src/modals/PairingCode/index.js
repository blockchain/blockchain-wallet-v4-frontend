import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import QRCodeReact from 'qrcode-react'

import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'blockchain-info-components'
import modalEnhancer from 'providers/ModalEnhancer'

const QRCodeContainer = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;
  width: 100;
  padding: 30px 0;
`

const PairingCode = (props) => {
  const { data, position, total, close, closeAll } = props

  return (
    <Modal size='large' position={position} total={total}>
      <ModalHeader icon='request' onClose={closeAll}>
        <FormattedMessage id='modals.pairingcode.title' defaultMessage='Pairing code' />
      </ModalHeader>
      <ModalBody>
        <FormattedMessage id='modals.pairingcode.scan' defaultMessage='Scan Pairing Code' />
        <QRCodeContainer>
          <QRCodeReact value={data} size={256} />
        </QRCodeContainer>
      </ModalBody>
      <ModalFooter>
        <Button nature='secondary' fullwidth onClick={close}>
          <FormattedMessage id='modals.pairingcode.close' defaultMessage='Close' />
        </Button>
      </ModalFooter>
    </Modal>
  )
}

PairingCode.propTypes = {
  data: PropTypes.string.isRequired,
  handleClose: PropTypes.func
}

export default modalEnhancer('PairingCode')(PairingCode)
