import React from 'react'
import PropTypes from 'prop-types'
import BrowserDetection from 'react-browser-detection'
import QrReader from 'react-qr-reader'

const QRReader = props => {
  const { onScan, onError } = props

  return (
    <BrowserDetection once>
      {{
        safari: () => <QrReader onImageLoad={onScan} onError={onError} legacyMode />,
        default: () => <QrReader onScan={onScan} onError={onError} />
      }}
    </BrowserDetection>
  )
}

QRReader.propTypes = {
  onScan: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired
}

export default QRReader
