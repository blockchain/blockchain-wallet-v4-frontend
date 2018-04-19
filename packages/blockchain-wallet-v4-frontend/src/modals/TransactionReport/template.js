import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'

import { Modal, ModalHeader, ModalBody, Tooltip } from 'blockchain-info-components'

const TransactionReport = props => (
  <Modal size='xlarge' position={props.position} total={props.total}>
    <ModalHeader icon='bitcoin-receipt' onClose={props.closeAll}>
      <FormattedMessage id='modals.transactionreport.title' defaultMessage='Export History' />
      <Tooltip>
        <FormattedMessage id='modals.firststep.transactionreport.help' defaultMessage='Export the transaction history of your addresses in CSV format' />
      </Tooltip>
    </ModalHeader>
    <ModalBody>
      {props.children}
    </ModalBody>
  </Modal>
)

TransactionReport.propTypes = {
  position: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  closeAll: PropTypes.func.isRequired
}

export default TransactionReport
