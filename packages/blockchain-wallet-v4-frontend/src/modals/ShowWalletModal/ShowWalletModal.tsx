import React from 'react'

import { Modal, ModalBody, ModalHeader } from 'blockchain-info-components'

import { ShowWalletModalComponent } from './ShowWalletModal.types'

export const ShowWalletModal: ShowWalletModalComponent = () => {
  return (
    <Modal size='large'>
      <ModalHeader />

      <ModalBody />
    </Modal>
  )
}
