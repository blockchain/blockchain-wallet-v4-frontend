import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'

import { Modal, ModalHeader, ModalBody } from 'blockchain-info-components'

const TransactionReport = props => (
  <Modal size='medium' position={props.position} total={props.total}>
    <ModalHeader onClose={props.closeAll}>
      <FormattedMessage id='modals.transactionreport.title' defaultMessage='Export Transactions History' />
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
