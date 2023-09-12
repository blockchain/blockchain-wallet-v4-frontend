import React from 'react'
import PropTypes from 'prop-types'
import QRCodeReact from 'qrcode.react'
import styled from 'styled-components'

const Wrapper = styled.div`
  canvas {
    padding: ${(props) => props.padding ?? '12px'};
    border: 1px solid ${(props) => props.theme.grey000};
    border-radius: ${(props) => props.borderRadius ?? '6px'};
    background-color: white;
    box-shadow: ${(props) => props.boxShadow};
  }
`

const QRCodeWrapper = ({ size, style, value }) => (
  <Wrapper {...style}>
    <QRCodeReact value={value} size={size} />
  </Wrapper>
)

QRCodeWrapper.propTypes = {
  size: PropTypes.number.isRequired,
  style: PropTypes.objectOf(PropTypes.string),
  value: PropTypes.string.isRequired
}

export default QRCodeWrapper
