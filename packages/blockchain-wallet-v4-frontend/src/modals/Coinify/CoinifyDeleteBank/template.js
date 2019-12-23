import { FormattedMessage } from 'react-intl'
import React from 'react'

import {
  Button,
  Link,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Text
} from 'blockchain-info-components'

const CoinifyDeleteBank = props => {
  const { close, position, total, ...rest } = props
  const { handleSubmit } = rest

  return (
    <Modal size='large' position={position} total={total}>
      <ModalHeader onClose={close}>
        <FormattedMessage
          id='modals.coinifydeletebank.title'
          defaultMessage='Delete bank Account?'
        />
      </ModalHeader>
      <ModalBody>
        <Text size='14px' weight={400}>
          <FormattedMessage
            id='modals.coinifydeletebank.explain'
            defaultMessage='Are you sure you want to delete this bank account?'
          />
        </Text>
      </ModalBody>
      <ModalFooter align='spaced'>
        <Link size='13px' weight={400} onClick={close}>
          <FormattedMessage
            id='modals.coinifydeletebank.cancel'
            defaultMessage='Cancel'
          />
        </Link>
        <Button onClick={handleSubmit} nature='warning'>
          <FormattedMessage
            id='modals.coinifydeletebank.logout'
            defaultMessage='Delete'
          />
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default CoinifyDeleteBank
