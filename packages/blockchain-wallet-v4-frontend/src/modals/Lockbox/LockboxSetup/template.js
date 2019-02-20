import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Modal, ModalBody, ModalHeader } from 'blockchain-info-components'

const Header = styled(ModalHeader)`
  & > :first-child > div {
    font-size: 16px;
    font-weight: 500;
  }
`

const LockboxSetup = props => {
  const { children, position, total, onClose, title } = props

  return (
    <Modal size='small' position={position} total={total}>
      <Header onClose={onClose}>{title()}</Header>
      <ModalBody>{children}</ModalBody>
    </Modal>
  )
}

LockboxSetup.propTypes = {
  position: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired
}

export default LockboxSetup
