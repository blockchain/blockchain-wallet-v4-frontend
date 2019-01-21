import React from 'react'
import PropTypes from 'prop-types'
import QrReader from 'react-qr-reader'
import { Banner } from 'blockchain-info-components'
import { FormattedMessage } from 'react-intl'
import { hasWebcam } from 'utils/helpers'

const QRReader = props => {
  const { onScan, onError } = props

  return hasWebcam ? (
    <QrReader onScan={onScan} onError={onError} />
  ) : (
    <Banner type='warning'>
      <FormattedMessage
        id='components.qrreader.warning'
        defaultMessage='Your browser does not have webcam support.'
      />
    </Banner>
  )
}

QRReader.propTypes = {
  onScan: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired
}

export default QRReader
