import React from 'react'
import PropTypes from 'prop-types'

import { Modal } from 'blockchain-info-components'

const LockboxFirmware = props => (
  <Modal size='large' position={props.position} total={props.total}>
    {props.children}
  </Modal>
)

LockboxFirmware.propTypes = {
  position: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  closeAll: PropTypes.func.isRequired
}

export default LockboxFirmware
