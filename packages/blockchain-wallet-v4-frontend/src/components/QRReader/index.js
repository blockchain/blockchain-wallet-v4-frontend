import { Banner } from 'blockchain-info-components'
import { FormattedMessage } from 'react-intl'
import { hasWebcam } from 'utils/helpers'
import PropTypes from 'prop-types'
import QrReader from 'react-qr-reader'
import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  > section > section > div {
    border: 30px solid rgba(0, 0, 0, 0.3) !important;
    box-shadow: rgba(255, 255, 255, 0.5) 0px 0px 0px 4px inset !important;
  }
`

const QRReader = props => {
  const { onScan, onError } = props

  return hasWebcam ? (
    <Container>
      <QrReader onScan={onScan} onError={onError} />
    </Container>
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
