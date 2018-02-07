import React from 'react'
import styled from 'styled-components'
import { Modal } from 'blockchain-info-components'

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
    <TrayModal {...rest}>
      {children}
    </TrayModal>
  )
}

export default Tray
