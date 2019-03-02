import React from 'react'
import { actions, model, selectors } from 'data'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import DeviceStatus from './template'

const { REMOVE_DEVICE } = model.analytics.LOCKBOX_EVENTS.SETTINGS
class RemoveDeviceContainer extends React.PureComponent {
  deleteDevice = () => {
    this.props.lockboxActions.deleteDevice(this.props.deviceIndex)
    this.props.analyticsActions.logEvent(REMOVE_DEVICE)
  }

  render () {
    const { deviceName } = this.props
    return (
      <DeviceStatus deleteDevice={this.deleteDevice} deviceName={deviceName} />
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  deviceName: selectors.core.kvStore.lockbox
    .getDeviceName(state, ownProps.deviceIndex)
    .getOrFail()
})

const mapDispatchToProps = dispatch => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  lockboxActions: bindActionCreators(actions.components.lockbox, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RemoveDeviceContainer)
