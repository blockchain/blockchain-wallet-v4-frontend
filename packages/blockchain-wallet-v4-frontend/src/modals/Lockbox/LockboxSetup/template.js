import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Modal, ModalBody, ModalHeader } from 'blockchain-info-components'

const ModalWrapper = styled(Modal)`
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.25);
`
const Header = styled(ModalHeader)`
  & > :first-child > div {
    font-size: 16px;
    font-weight: 500;
  }
`

const LockboxSetup = props => {
  const { children, onClose, position, title, total } = props

  return (
    <ModalWrapper size='small' position={position} total={total}>
      <Header onClose={onClose}>{title()}</Header>
      <ModalBody>{children}</ModalBody>
    </ModalWrapper>
  )
}

LockboxSetup.propTypes = {
  position: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired
}

export default LockboxSetup
