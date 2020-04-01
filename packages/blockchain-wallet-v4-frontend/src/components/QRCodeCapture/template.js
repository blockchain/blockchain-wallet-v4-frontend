import { HeartbeatLoader, Image } from 'blockchain-info-components'
import PropTypes from 'prop-types'
import QRReader from '../QRReader'
import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  min-width: 48px;
  width: 48px;
  height: 48px;
  cursor: pointer;
  box-sizing: border-box;
  border-radius: 8px;
  border-top: ${props =>
    props.border.indexOf('top') > -1 && `1px solid ${props.theme['gray-2']}`};
  border-right: ${props =>
    props.border.indexOf('right') > -1 && `1px solid ${props.theme['gray-2']}`};
  border-bottom: ${props =>
    props.border.indexOf('bottom') > -1 &&
    `1px solid ${props.theme['gray-2']}`};
  border-left: ${props =>
    props.border.indexOf('left') > -1 && `1px solid ${props.theme['gray-2']}`};

  &:hover {
    background-color: ${props => props.theme['gray-1']};
  }
`
const TooltipBox = styled.div`
  position: absolute;
  bottom: 50px;
  left: -180px;
  width: 230px;
  display: block;
  background-color: ${props => props.theme['gray-1']};
  border: 1px solid ${props => props.theme['gray-2']};
  border-radius: 0px;
  padding: 5px;
  box-sizing: border-box;

  & > section > video,
  canvas {
    width: 100%;
  }

  &:before {
    content: '';
    display: block;
    position: absolute;
    left: 185px;
    top: 100%;
    width: 0;
    height: 0;
    border: 10px solid transparent;
    border-top-color: ${props => props.theme['gray-2']};
  }

  &:after {
    content: '';
    display: block;
    position: absolute;
    left: 186px;
    top: 100%;
    width: 0;
    height: 0;
    border: 9px solid transparent;
    border-top-color: ${props => props.theme['gray-1']};
  }
`

const QRCodeCapture = props => {
  const { border, toggled, handleToggle, handleScan, handleError } = props

  return (
    <Wrapper border={border} onClick={handleToggle}>
      {!toggled && <Image name='qr-code' width='20px' height='20px' />}
      {toggled && (
        <HeartbeatLoader
          width='24px'
          height='24px'
          color='success'
          onClick={handleToggle}
        />
      )}
      {toggled && (
        <TooltipBox>
          <QRReader onScan={handleScan} onError={handleError} />
        </TooltipBox>
      )}
    </Wrapper>
  )
}

QRCodeCapture.propTypes = {
  toggled: PropTypes.bool.isRequired,
  handleToggle: PropTypes.func.isRequired,
  handleScan: PropTypes.func.isRequired,
  handleError: PropTypes.func.isRequired
}

export default QRCodeCapture
