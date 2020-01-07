import { Banner, BlockchainLoader } from 'blockchain-info-components'
import { checkHasWebcam } from 'utils/helpers'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import QrReader from 'react-qr-reader'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

const Container = styled.div`
  > section > section > div {
    border: 30px solid rgba(0, 0, 0, 0.3) !important;
    box-shadow: rgba(255, 255, 255, 0.5) 0px 0px 0px 4px inset !important;
  }
`

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0.5;
  padding: 20px;
  margin: 20px;
`

const QRReader = props => {
  const { onScan, onError } = props
  const [hasWebcam, setHasWebcam] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkHasWebcam().then(res => {
      setHasWebcam(res)
      setIsLoading(false)
    })
  }, [])

  return isLoading ? (
    <Wrapper>
      <BlockchainLoader width='150px' height='150px' />
    </Wrapper>
  ) : hasWebcam ? (
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
