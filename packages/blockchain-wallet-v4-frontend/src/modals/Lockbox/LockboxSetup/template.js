import React from 'react'
import PropTypes from 'prop-types'

import { Modal, ModalBody, ModalHeader } from 'blockchain-info-components'

const LockboxSetup = props => {
  const { children, position, total, onClose, title } = props

  return (
    <Modal size='small' position={position} total={total}>
      <ModalHeader onClose={onClose}>{title()}</ModalHeader>
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
