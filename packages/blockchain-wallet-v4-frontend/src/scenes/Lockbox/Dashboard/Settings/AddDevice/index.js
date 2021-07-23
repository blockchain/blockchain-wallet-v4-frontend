import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'

import { actions } from 'data'

import AddDevice from './template'

class AddDeviceContainer extends React.PureComponent {
  onClick = () => {
    this.props.lockboxActions.changeDeviceSetupStep('device-select')
    this.props.modalActions.showModal('LOCKBOX_SETUP_MODAL')
  }

  render() {
    return <AddDevice onClick={this.onClick} isBrowserSupported={this.props.isBrowserSupported} />
  }
}

const mapDispatchToProps = (dispatch) => ({
  lockboxActions: bindActionCreators(actions.components.lockbox, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch)
})

AddDeviceContainer.propTypes = {
  isBrowserSupported: PropTypes.bool.isRequired
}

export default connect(null, mapDispatchToProps)(AddDeviceContainer)
