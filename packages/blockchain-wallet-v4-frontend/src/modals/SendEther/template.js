import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'

import { Modal, ModalHeader, ModalBody } from 'blockchain-info-components'

const SendEther = props => {
  console.log(props)

  return (
    <Modal size='large' position={props.position} total={props.total}>
      <ModalHeader icon='send' onClose={props.closeAll}>
        <FormattedMessage id='modals.sendether.firststep.title' defaultMessage='Send Ethereum' />
      </ModalHeader>
      <ModalBody>
        {props.children}
      </ModalBody>
    </Modal>
  )
}

SendEther.propTypes = {
  position: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired
}

export default SendEther
