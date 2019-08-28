import React from 'react'
import { actions, model } from 'data'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'

import UpdateDevice from './template'

const { FIRMWARE_UPDATE } = model.analytics.LOCKBOX_EVENTS.SETTINGS
class UpdateDeviceContainer extends React.PureComponent {
  onCheckForUpdates = () => {
    this.props.modalActions.showModal('LockboxFirmware', {
      deviceIndex: this.props.deviceIndex
    })
    this.props.analyticsActions.logEvent(FIRMWARE_UPDATE)
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
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  lockboxActions: bindActionCreators(actions.components.lockbox, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch)
})

export default connect(
  null,
  mapDispatchToProps
)(UpdateDeviceContainer)
