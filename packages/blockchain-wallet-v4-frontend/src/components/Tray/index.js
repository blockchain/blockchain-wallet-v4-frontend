import React from 'react'
import styled from 'styled-components'
import { Modal } from 'blockchain-info-components'
import Transition from 'react-transition-group/Transition'

const duration = 500

const defaultStyle = {
  transition: `top ${duration}ms`,
  top: '100%'
}

const transitionStyles = {
  entering: { top: '100%' },
  entered: { top: '60px' }
}

const TrayModal = styled(Modal)`
  left: 270px;
  font-weight: 300;
  position: absolute;
  width: calc(100% - 270px);
  height: 100vh;
  overflow: auto;
  color: ${props => props.theme['gray-5']};
  font-family: 'Montserrat', Helvetica, sans-serif;
  > div:first-child {
    padding: 70px 40px 40px 40px;
    > span:last-child {
      top: 30px;
      right: 40px;
      position: absolute;
    }
  }
  > div:last-child {
    padding: 40px 40px;
  }
`

const Tray = props => {
  const { children, ...rest } = props
  return (
    <Transition in={props.in} timeout={0}>
      {(status) => (
        <TrayModal {...rest} type={'tray'} style={{...defaultStyle, ...transitionStyles[status]}}>
          {children}
        </TrayModal>
      )}
    </Transition>
  )
}

export default Tray
