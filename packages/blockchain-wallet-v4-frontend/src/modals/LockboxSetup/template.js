import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'

import { Modal, ModalHeader, ModalBody } from 'blockchain-info-components'

const LockboxSetup = props => (
  <Modal size='large' position={props.position} total={props.total}>
    <ModalHeader icon='lock' onClose={props.closeAll}>
      <FormattedMessage
        id='modals.lockboxsetup.title'
        defaultMessage='Get started with your Lockbox'
      />
    </ModalHeader>
    <ModalBody>{props.children}</ModalBody>
  </Modal>
)

LockboxSetup.propTypes = {
  position: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  closeAll: PropTypes.func.isRequired
}

export default LockboxSetup
