import { actions } from 'data'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import React from 'react'
import UpdateDevice from './template'

class UpdateDeviceContainer extends React.PureComponent {
  onCheckForUpdates = () => {
    this.props.modalActions.showModal('LockboxFirmware', {
      deviceIndex: this.props.deviceIndex
    })
  }

  render () {
    return (
      <UpdateDevice
        onCheckForUpdates={this.onCheckForUpdates}
        isBrowserSupported={this.props.isBrowserSupported}
      />
    )
  }
}

UpdateDeviceContainer.propTypes = {
  isBrowserSupported: PropTypes.bool.isRequired
}

const mapDispatchToProps = dispatch => ({
  lockboxActions: bindActionCreators(actions.components.lockbox, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch)
})

export default connect(
  null,
  mapDispatchToProps
)(UpdateDeviceContainer)
