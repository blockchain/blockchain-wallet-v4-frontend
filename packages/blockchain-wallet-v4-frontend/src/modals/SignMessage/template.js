import React from 'react'
import { FormattedMessage } from 'react-intl'
import {
  Modal,
  ModalBody,
  ModalHeader,
  TooltipHost,
  TooltipIcon
} from 'blockchain-info-components'
import PropTypes from 'prop-types'

const SignMessage = props => (
  <Modal size='medium' position={props.position} total={props.total}>
    <ModalHeader onClose={props.closeAll}>
      <FormattedMessage
        id='modals.signmessage.title'
        defaultMessage='Sign Message'
      />
      <TooltipHost id='signmessage.label.tooltip'>
        <TooltipIcon name='info' />
      </TooltipHost>
    </ModalHeader>
    <ModalBody>{props.children}</ModalBody>
  </Modal>
)

SignMessage.propTypes = {
  position: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  closeAll: PropTypes.func.isRequired
}

export default SignMessage
