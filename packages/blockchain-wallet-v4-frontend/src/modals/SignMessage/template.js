import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'

import { Modal, ModalHeader, ModalBody, Tooltip } from 'blockchain-info-components'

const SignMessage = props => (
  <Modal size='medium' position={props.position} total={props.total}>
    <ModalHeader onClose={props.closeAll}>
      <FormattedMessage id='modals.signmessage.title' defaultMessage='Sign Message' />
      <Tooltip>
        <FormattedMessage id='modals.signmessage.label'
          defaultMessage='By signing a message, you can prove that you own this bitcoin address. You can verify signed messages by clicking on "More Actions > Verify Message".' />
      </Tooltip>
    </ModalHeader>
    <ModalBody>
      {props.children}
    </ModalBody>
  </Modal>
)

SignMessage.propTypes = {
  position: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  closeAll: PropTypes.func.isRequired
}

export default SignMessage
