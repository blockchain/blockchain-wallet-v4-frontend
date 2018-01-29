import React from 'react'
import { Modal, ModalHeader, ModalBody } from 'blockchain-info-components'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'

const ImportBitcoinAddress = (props) => {
  const { position, close } = props

  return (
    <Modal size='large' position={position}>
      <ModalHeader icon='up-arrow-in-circle' onClose={close}>
        <FormattedMessage id='modals.importbitcoinaddress.title' defaultMessage='Import Existing Bitcoin Address' />
      </ModalHeader>
      <ModalBody>
        <FormattedMessage id='modals.importbitcoinaddress.body' defaultMessage='Import Existing Bitcoin Address' />
      </ModalBody>
    </Modal>
  )
}

export default reduxForm({ form: 'importBitcoinAddress' })(ImportBitcoinAddress)
