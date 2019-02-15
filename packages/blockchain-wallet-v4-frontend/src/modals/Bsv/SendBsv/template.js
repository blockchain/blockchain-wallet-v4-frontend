import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'

import { Modal, ModalHeader, ModalBody } from 'blockchain-info-components'

const SendBsv = props => (
  <Modal size='large' position={props.position} total={props.total}>
    <ModalHeader icon='send' onClose={props.closeAll}>
      <FormattedMessage
        id='modals.sendbsv.title'
        defaultMessage='Send Bitcoin SV'
      />
    </ModalHeader>
    <ModalBody>{props.children}</ModalBody>
  </Modal>
)

SendBsv.propTypes = {
  position: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  closeAll: PropTypes.func.isRequired
}

export default SendBsv
