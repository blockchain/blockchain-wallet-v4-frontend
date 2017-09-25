import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Button, Carousel, Modal, ModalHeader, ModalBody, ModalFooter } from 'blockchain-info-components'

const UpgradeWizard = (props) => {
  const { position, total, closeAll, close, ...rest } = props
  const { handleConfirm } = rest

  return (
    <Modal size='large' position={position} total={total}>
      <ModalHeader onClose={closeAll}>
        <FormattedMessage id='modals.upgradewizard.title' defaultMessage='Welcome to your Blockchain Wallet!' />
      </ModalHeader>
      <ModalBody>
        <Carousel>

        </Carousel>
      </ModalBody>
      <ModalFooter align='right'>
        <Button type='submit' nature='primary' onClick={handleConfirm}>
          <FormattedMessage id='modals.upgradewizard.confirm' defaultMessage='Upgrade' />
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default UpgradeWizard
