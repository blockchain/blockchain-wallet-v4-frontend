import React from 'react'
import QRCodeReact from 'qrcode.react'
import styled from 'styled-components'

const Wrapper = styled.div`
  canvas {
    border: 1px solid white;
  }
`

const PairingCode = (props) => {
  const { val } = props
  return (
    <Wrapper>
      <QRCodeReact value={val} size={256} />
    </Wrapper>
  )
}

export default PairingCode
