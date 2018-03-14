import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import QRReader from '../QRReader'

import { Image, HeartbeatLoader } from 'blockchain-info-components'

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  border: 1px solid ${props => props.theme['gray-2']};
  box-sizing: border-box;
  cursor: pointer;

  &:hover { background-color: ${props => props.theme['gray-1']}; }
`
const TooltipBox = styled.div`
  position: absolute;
  bottom: 50px;
  left: -180px;
  width: 230px;
  display: block;
  background-color: ${props => props.theme['gray-1']};
  border: 1px solid ${props => props.theme['gray-2']};
  border-radius: 5px;
  padding: 5px;
  box-sizing: border-box;

  & > section > video, canvas { width: 100%; }

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
  const { toggled, handleToggle, handleScan, handleError } = props
  return (
    <Wrapper>
      {!toggled && <Image name='qr-code' width='30px' height='30px' onClick={handleToggle} />}
      {toggled && <HeartbeatLoader width='30px' height='30px' color='red' onClick={handleToggle} />}
      {toggled &&
        <TooltipBox>
          <QRReader onScan={handleScan} onError={handleError} />
        </TooltipBox>
      }
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
