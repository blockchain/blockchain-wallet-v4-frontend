import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Modal, ModalHeader, ModalBody, Text } from 'blockchain-info-components'

const TwoStepCivic = (props) => {
  const { position, total } = props

  return (
    <Modal size='medium' position={position} total={total}>
      <ModalHeader>
        <FormattedMessage id='modals.twostepcivic.title' defaultMessage='Enable 2-Step Verification' />
      </ModalHeader>
      <ModalBody>
        <Text size='14px' weight={500}>
          <FormattedMessage id='modals.twostepcivic.explain' defaultMessage='Pair with civic app' />
        </Text>
      </ModalBody>
    </Modal>
  )
}

export default TwoStepCivic
