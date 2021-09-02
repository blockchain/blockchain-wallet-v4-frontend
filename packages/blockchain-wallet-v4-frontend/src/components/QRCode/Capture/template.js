import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { HeartbeatLoader, Icon } from 'blockchain-info-components'

import QRReader from '../Reader'

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
  border-top: ${(props) => props.border.indexOf('top') > -1 && `1px solid ${props.theme.grey100}`};
  border-right: ${(props) =>
    props.border.indexOf('right') > -1 && `1px solid ${props.theme.grey100}`};
  border-bottom: ${(props) =>
    props.border.indexOf('bottom') > -1 && `1px solid ${props.theme.grey100}`};
  border-left: ${(props) =>
    props.border.indexOf('left') > -1 && `1px solid ${props.theme.grey100}`};
`
const TooltipBox = styled.div`
  position: absolute;
  bottom: 50px;
  left: -180px;
  width: 230px;
  display: block;
  background-color: ${(props) => props.theme.grey000};
  border: 1px solid ${(props) => props.theme.grey100};
  border-radius: 0px;
  padding: 5px;
  box-sizing: border-box;
  z-index: 4;

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
    border-top-color: ${(props) => props.theme.grey100};
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
    border-top-color: ${(props) => props.theme.grey000};
  }
`

const QRCodeCapture = (props) => {
  const { border, handleError, handleScan, handleToggle, toggled } = props

  return (
    <Wrapper border={border} onClick={handleToggle}>
      {!toggled && <Icon name='qr-code' color='grey500' width='20px' height='20px' />}
      {toggled && (
        <HeartbeatLoader width='24px' height='24px' color='success' onClick={handleToggle} />
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
  handleError: PropTypes.func.isRequired,
  handleScan: PropTypes.func.isRequired,
  handleToggle: PropTypes.func.isRequired,
  toggled: PropTypes.bool.isRequired
}

export default QRCodeCapture
