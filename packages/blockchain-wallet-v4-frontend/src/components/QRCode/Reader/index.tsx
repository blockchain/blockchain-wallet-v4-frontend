import React, { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import QrReader from 'react-qr-reader'
import styled from 'styled-components'

import { Banner, BlockchainLoader } from 'blockchain-info-components'
import { checkHasWebcam } from 'utils/helpers'

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

const QRReader = (props: Props) => {
  const { onError, onScan } = props
  const [hasWebcam, setHasWebcam] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkHasWebcam().then((res) => {
      setHasWebcam(res)
      setIsLoading(false)
    })
  }, [])

  return isLoading ? (
    <Wrapper>
      <BlockchainLoader width='80px' height='80px' />
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

type Props = {
  onError: (s: string) => void
  onScan: (s: string) => void
}

export default QRReader
