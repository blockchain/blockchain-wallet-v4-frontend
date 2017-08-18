import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import QrReader from 'react-qr-reader'

import { Link, Modal } from 'blockchain-info-components'

const DELAY = 100

const QRCodeContainer = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;
  width: 100;
  padding: 30px 0;
`
const Footer = styled.div`
  padding: 5px 0;
`
const QrCodeReader = styled(QrReader)`
  width: 100%;
  height: 100%;

  & > * { width: 100%; }
`

const QRCodeCapture = ({ handleScan, handleBack, handleError, ...rest }) => (
  <Modal {...rest} icon='send' title='Payment address' size='large'>
    <FormattedMessage id='modals.qrcodecapture.scan' defaultMessage='Capture QR Code' />
    <QRCodeContainer>
      <QrCodeReader delay={DELAY} onScan={handleScan} onError={handleError} />
    </QRCodeContainer>
    <Footer>
      <Link onClick={handleBack}>
        <FormattedMessage id='modals.qrcodecapture.back' defaultMessage='Go back' />
      </Link>
    </Footer>
  </Modal>
)

QRCodeCapture.propTypes = {
  handleScan: PropTypes.func.isRequired,
  handleError: PropTypes.func,
  handleBack: PropTypes.func
}

export default QRCodeCapture
