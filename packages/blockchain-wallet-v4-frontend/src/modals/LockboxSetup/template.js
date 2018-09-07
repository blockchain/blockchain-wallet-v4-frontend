import React from 'react'
import PropTypes from 'prop-types'

import { Modal, ModalBody } from 'blockchain-info-components'

const LockboxSetup = props => (
  <Modal size='large' position={props.position} total={props.total}>
    <ModalBody>{props.children}</ModalBody>
  </Modal>
)

LockboxSetup.propTypes = {
  position: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  closeAll: PropTypes.func.isRequired
}

export default LockboxSetup
