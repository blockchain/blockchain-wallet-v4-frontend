import React from 'react'
import { FormattedMessage } from 'react-intl'

import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from 'blockchain-info-components'

const UpgradeWallet = props => {
  const { position, total, ...rest } = props
  const { handleContinue } = rest

  return (
    <Modal size='large' position={position} total={total}>
      <ModalHeader closeButton={false}>
        <FormattedMessage
          id='modals.upgradewallet.title'
          defaultMessage='Welcome to your Blockchain Wallet!'
        />
      </ModalHeader>
      <ModalBody>Click Continue to Upgrade Wallet</ModalBody>
      <ModalFooter align='right'>
        <Button nature='primary' onClick={handleContinue}>
          <FormattedMessage
            id='modals.upgradewallet.continue'
            defaultMessage='Continue'
          />
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default UpgradeWallet
