import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'

import { Modal, ModalHeader, ModalBody } from 'blockchain-info-components'

const RequestBitcoin = props => (
  <Modal size='large' position={props.position} total={props.total}>
    <ModalHeader icon='request' onClose={props.closeAll}>
      <FormattedMessage
        id='modals.requestbitcoin.title'
        defaultMessage='Request Bitcoin'
      />
    </ModalHeader>
    <ModalBody>{props.children}</ModalBody>
  </Modal>
)

RequestBitcoin.propTypes = {
  position: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  closeAll: PropTypes.func.isRequired
}

export default RequestBitcoin
