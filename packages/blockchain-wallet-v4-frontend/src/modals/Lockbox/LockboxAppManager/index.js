import React from 'react'
import PropTypes from 'prop-types'
import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'

import { Modal, ModalHeader } from 'blockchain-info-components'
import { actions } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'
import { AppManager } from 'components/Lockbox'

class LockboxAppManagerModal extends React.PureComponent {
  state = {}

  onClose = () => {
    this.props.lockboxActions.lockboxModalClose()
    this.props.closeAll()
  }

  render () {
    const { deviceIndex, position, total } = this.props
    return (
      <Modal size='small' position={position} total={total}>
        <ModalHeader onClose={this.onClose}>
          <FormattedMessage
            id='modals.lockbox.appmanager.title'
            defaultMessage='App Manager'
          />
        </ModalHeader>
        <AppManager deviceIndex={deviceIndex} />
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
  connect(
    null,
    mapDispatchToProps
  )
)

export default enhance(LockboxAppManagerModal)
