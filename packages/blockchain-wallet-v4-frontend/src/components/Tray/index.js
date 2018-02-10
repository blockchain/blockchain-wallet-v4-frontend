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
  position: absolute;
  width: calc(100% - 270px);
  height: calc(100% - 60px);
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
