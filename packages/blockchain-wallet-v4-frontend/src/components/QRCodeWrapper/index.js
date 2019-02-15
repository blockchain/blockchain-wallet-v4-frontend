import React from 'react'
import QRCodeReact from 'qrcode.react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const Wrapper = styled.div`
  canvas {
    border: 1px solid white;
  }
`

const QRCodeWrapper = props => {
  const { value, size } = props

  return (
    <Wrapper>
      <QRCodeReact value={value} size={size} />
    </Wrapper>
  )
}

QRCodeWrapper.propTypes = {
  value: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired
}

export default QRCodeWrapper
