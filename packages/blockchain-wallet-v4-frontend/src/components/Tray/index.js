import React from 'react'
import styled from 'styled-components'
import { Modal } from 'blockchain-info-components'
import Transition from 'react-transition-group/Transition'

const duration = 300

const defaultStyle = {
  transition: `opacity ${duration}ms ease-in-out`,
  opacity: 0
}

const transitionStyles = {
  entering: { opacity: 0 },
  entered: { opacity: 1 }
}

const TrayModal = styled(Modal)`
  top: 60px;
  left: 270px;
  position: absolute;
  width: calc(100% - 270px);
  height: calc(100% - 60px);
`

const Tray = props => {
  const { children, ...rest } = props
  return (
    <Transition in={props.show} timeout={duration}>
      {(status) => (
        <TrayModal {...rest} className={status} style={{...defaultStyle, ...transitionStyles[status]}}>
          {children}
        </TrayModal>
      )}
    </Transition>
  )
}

export default Tray
