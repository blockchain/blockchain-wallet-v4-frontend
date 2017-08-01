import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import QrReader from 'react-qr-reader'

import { Link } from 'components/generic/Link'
import { Text } from 'components/generic/Text'
import Modal from 'components/generic/Modal'

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

const QRCodeCapture = (props) => {
  const { handleScan, handleError, handleBack, ...rest } = props
  const delay = 100

  return (
    <Modal {...rest} icon='icon-send' title='Payment address' size='large'>
      <Text id='modals.qrcodecapture.scan' text='Capture QR Code' small light />
      <QRCodeContainer>
        <QrCodeReader delay={delay} onScan={handleScan} onError={handleError} />
      </QRCodeContainer>
      {handleBack &&
        <Footer>
          <Link onClick={handleBack}>
            <Text id='modals.qrcodecapture.back' text='Go back' small light cyan />
          </Link>
        </Footer>
      }
    </Modal>
  )
}

QRCodeCapture.propTypes = {
  handleScan: PropTypes.func.isRequired,
  handleError: PropTypes.func,
  handleBack: PropTypes.func
}

export default QRCodeCapture
