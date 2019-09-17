import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Modal, ModalBody, Text } from 'blockchain-info-components'

const UpgradeWallet = props => {
  const { position, total } = props

  return (
    <Modal size='small' position={position} total={total}>
      <ModalBody style={{ textAlign: 'center' }}>
        <Text size='16px' weight={600}>
          <FormattedMessage
            id='modals.upgradewallet.upgradingtolatest'
            defaultMessage='Upgrading your Wallet to our latest version.'
          />
        </Text>
        <Text size='16px' weight={600}>
          <FormattedMessage
            id='modals.upgradewallet.hangtight'
            defaultMessage='Hang tight.'
          />
        </Text>
      </ModalBody>
    </Modal>
  )
}

export default UpgradeWallet
