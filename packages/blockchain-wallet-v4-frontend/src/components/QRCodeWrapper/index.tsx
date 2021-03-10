import React from 'react'
import QRCodeReact from 'qrcode.react'
import styled from 'styled-components'

import blockChainLogo from 'blockchain-info-components/src/Images/img/qr-logo.svg'

const Wrapper = styled.div`
  canvas {
    padding: 12px;
    border: 1px solid ${props => props.theme.grey000};
    border-radius: 6px;
    background-color: white;
  }
`

const imageSettings = {
  src: blockChainLogo,
  x: null,
  y: null,
  height: 45,
  width: 45,
  excavate: false
}

const QRCodeWrapper = (props: Props) => {
  const { showImage, size, value } = props

  return (
    <Wrapper>
      <QRCodeReact
        value={value}
        size={size}
        imageSettings={showImage ? imageSettings : null}
      />
    </Wrapper>
  )
}

type Props = {
  showImage?: boolean
  size: number
  value: string
}

export default QRCodeWrapper
