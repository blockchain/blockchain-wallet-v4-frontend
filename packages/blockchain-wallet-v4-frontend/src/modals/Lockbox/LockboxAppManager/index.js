import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { bindActionCreators, compose } from 'redux'

import { Modal, ModalBody, ModalHeader } from 'blockchain-info-components'
import { actions } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'

import AppManager from '../components/AppManager'

class LockboxAppManagerModal extends React.PureComponent {
  onClose = () => {
    this.props.lockboxActions.lockboxModalClose()
    this.props.closeAll()
  }

  render() {
    const { deviceIndex, position, total } = this.props
    return (
      <Modal size='small' position={position} total={total}>
        <ModalHeader onClose={this.onClose}>
          <FormattedMessage
            id='modals.lockbox.appmanager.title'
            defaultMessage='App Manager'
          />
        </ModalHeader>
        <ModalBody style={{ padding: '18px' }}>
          <AppManager
            deviceIndex={deviceIndex}
            mainButtonText={
              <FormattedMessage
                id='modals.lockbox.appmanager.close'
                defaultMessage='Close App Manager'
              />
            }
            onClose={this.onClose}
          />
        </ModalBody>
      </Modal>
    )
  }
}

LockboxAppManagerModal.propTypes = {
  deviceIndex: PropTypes.string.isRequired,
  position: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  closeAll: PropTypes.func.isRequired
}

const mapDispatchToProps = dispatch => ({
  lockboxActions: bindActionCreators(actions.components.lockbox, dispatch)
})

const enhance = compose(
  modalEnhancer('LockboxAppManager'),
  connect(null, mapDispatchToProps)
)

export default enhance(LockboxAppManagerModal)
