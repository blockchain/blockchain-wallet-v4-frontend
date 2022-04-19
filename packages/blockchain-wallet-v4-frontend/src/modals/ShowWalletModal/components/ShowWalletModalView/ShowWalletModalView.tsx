import React from 'react'

import { Modal, ModalBody, ModalFooter, ModalHeader } from 'blockchain-info-components'

import { ShowWalletModalViewComponent } from './ShowWalletModalView.types'

export const ShowWalletModalView: ShowWalletModalViewComponent = ({ actions, body, header }) => (
  <Modal size='large'>
    <ModalHeader>{header}</ModalHeader>

    <ModalBody>{body}</ModalBody>

    {actions !== null && <ModalFooter align='center' />}
  </Modal>
)
