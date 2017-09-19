import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import QrReader from 'react-qr-reader'

import { Link, Modal, ModalHeader, ModalBody, ModalFooter, Text } from 'blockchain-info-components'

const DELAY = 100

const QRCodeContainer = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;
  width: 100;
  padding: 30px 0;
`
const QrCodeReader = styled(QrReader)`
  width: 100%;
  height: 100%;

  & > * { width: 100%; }
`

const QRCodeCapture = (props) => {
  const { handleScan, handleError, position, total, close, closeAll } = props

  return (
    <Modal size='large' position={position} total={total}>
      <ModalHeader icon='send' onClose={closeAll}>
        <FormattedMessage id='modals.qrcodecapture.title' defaultMessage='Payment address' />
      </ModalHeader>
      <ModalBody>
        <Text size='14px' weight={500} capitalize>
          <FormattedMessage id='modals.qrcodecapture.scan' defaultMessage='Capture QR Code' />
        </Text>
        <QRCodeContainer>
          <QrCodeReader delay={DELAY} onScan={handleScan} onError={handleError} />
        </QRCodeContainer>
      </ModalBody>
      <ModalFooter>
        <Link onClick={close} size='13px' weight={300}>
          <FormattedMessage id='modals.qrcodecapture.back' defaultMessage='Go back' />
        </Link>
      </ModalFooter>
    </Modal>
  )
}

QRCodeCapture.propTypes = {
  handleScan: PropTypes.func.isRequired,
  handleError: PropTypes.func,
  handleBack: PropTypes.func
}

export default QRCodeCapture
