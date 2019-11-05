import { actions } from 'data'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import AddDevice from './template'
import PropTypes from 'prop-types'
import React from 'react'

class AddDeviceContainer extends React.PureComponent {
  onClick = () => {
    this.props.lockboxActions.changeDeviceSetupStep('device-select')
    this.props.modalActions.showModal('LockboxSetup')
  }

  render () {
    return (
      <AddDevice
        onClick={this.onClick}
        isBrowserSupported={this.props.isBrowserSupported}
      />
    )
  }
}

const mapDispatchToProps = dispatch => ({
  lockboxActions: bindActionCreators(actions.components.lockbox, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch)
})

AddDeviceContainer.propTypes = {
  isBrowserSupported: PropTypes.bool.isRequired
}

export default connect(
  null,
  mapDispatchToProps
)(AddDeviceContainer)
