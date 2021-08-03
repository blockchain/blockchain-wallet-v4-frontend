import React from 'react'
import QRCodeReact from 'qrcode.react'
import styled from 'styled-components'

import blockChainLogo from 'blockchain-info-components/src/Images/img/qr-logo.svg'

const Wrapper = styled.div`
  canvas {
    padding: 12px;
    border: 1px solid ${(props) => props.theme.grey000};
    border-radius: 6px;
    background-color: white;
  }
`

const imageSettings = {
  excavate: false,
  height: 45,
  src: blockChainLogo,
  width: 45,
  x: null,
  y: null
}

const QRCodeWrapper = (props: Props) => {
  const { showImage, size, value } = props
  return (
    <Wrapper>
      <QRCodeReact
        level='M'
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
