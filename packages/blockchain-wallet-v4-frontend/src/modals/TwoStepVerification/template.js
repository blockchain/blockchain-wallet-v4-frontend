import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Link, Modal, ModalHeader, ModalBody, ModalFooter, Text, TextGroup } from 'blockchain-info-components'

const TwoStepVerification = (props) => {
  const { position, total, close, closeAll, ...rest } = props
  const { } = rest

  return (
    <Modal size='large' position={position} total={total}>
      <ModalHeader icon='settings' onClose={closeAll} >
        <FormattedMessage id='modals.twostepverification.title' defaultMessage='Disabled Two Step' />
      </ModalHeader>
      <ModalBody>

      </ModalBody>
      <ModalFooter>
        <Link size='13px' weight={300} onClick={close}>
          <FormattedMessage id='modals.twostepverification.cancel' defaultMessage='Cancel' />
        </Link>
      </ModalFooter>
    </Modal>
  )
}

export default TwoStepVerification
