import React from 'react'
import { compose } from 'redux'
import { FormattedMessage } from 'react-intl'
import modalEnhancer from 'providers/ModalEnhancer'
import { Modal, ModalHeader, ModalBody } from 'blockchain-info-components'

class ImportBitcoinAddressContainer extends React.Component {
  render () {
    const { position, close } = this.props

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
}

const enhance = compose(modalEnhancer('ImportBitcoinAddress'))

export default enhance(ImportBitcoinAddressContainer)
