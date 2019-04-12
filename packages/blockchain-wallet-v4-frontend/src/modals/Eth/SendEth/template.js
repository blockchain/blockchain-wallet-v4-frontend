import React from 'react'
import PropTypes from 'prop-types'
import { FormattedHTMLMessage } from 'react-intl'

import { Modal, ModalHeader, ModalBody } from 'blockchain-info-components'

const SendEth = props => (
  <Modal size='large' position={props.position} total={props.total}>
    <ModalHeader icon='paper-airplane-filled' onClose={props.closeAll}>
      <FormattedHTMLMessage
        id='modals.sendeth.cointitle'
        defaultMessage='Send {coinDisplayName}'
        values={{ coinDisplayName: props.coinDisplayName }}
      />
    </ModalHeader>
    <ModalBody>{props.children}</ModalBody>
  </Modal>
)

SendEth.propTypes = {
  coinDisplayName: PropTypes.string.isRequired,
  position: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  closeAll: PropTypes.func.isRequired
}

export default SendEth
