import React from 'react'
import { FormattedMessage } from 'react-intl'
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  Text
} from 'blockchain-info-components'

import { Form } from 'components/Form'

const UpgradeWallet = props => {
  const { isDoubleEncrypted, position, total, ...rest } = props
  const { handleSubmit } = rest

  return (
    <Modal size='small' position={position} total={total}>
      <Form onSubmit={handleSubmit}>
        <ModalBody style={{ textAlign: 'center' }}>
          <Text size='16px' weight={600}>
            <FormattedMessage
              id='modals.upgradewallet.upgradingtolatest'
              defaultMessage='Upgrade your Wallet to our latest version.'
            />
          </Text>
          {isDoubleEncrypted && (
            <Text size='14px' weight={600}>
              <br />
              <FormattedMessage
                id='modals.upgradewallet.secpass'
                defaultMessage='Please have your Second Password handy.'
              />
            </Text>
          )}
        </ModalBody>
        <ModalFooter align='right'>
          <Button nature='primary' type='submit' data-e2e='confirmUpgrade'>
            <FormattedMessage
              id='modals.upgradewallet.upgrade'
              defaultMessage='Upgrade'
            />
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  )
}

export default UpgradeWallet
