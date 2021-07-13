import React from 'react'
import PropTypes from 'prop-types'
import QRCodeReact from 'qrcode.react'
import styled from 'styled-components'

const Wrapper = styled.div`
  canvas {
    padding: 12px;
    border: 1px solid ${props => props.theme.grey000};
    border-radius: 6px;
    background-color: white;
  }
`

const QRCodeWrapper = props => {
  const { size, value } = props

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
