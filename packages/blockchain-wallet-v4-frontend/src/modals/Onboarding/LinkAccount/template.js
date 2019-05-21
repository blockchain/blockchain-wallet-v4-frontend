import React from 'react'

import { Modal, ModalBody } from 'blockchain-info-components'

const LinkAccount = props => {
  return (
    <Modal size='medium'>
      <ModalBody>
        <div>Linking Your Account</div>
        <div>Current Status: {props.status}</div>
      </ModalBody>
    </Modal>
  )
}

export default LinkAccount
