import React from 'react'
import { selectors, actions } from 'data'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import DeviceStatus from './template.js'

class DeviceStatusContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.deleteDevice = this.deleteDevice.bind(this, props.deviceId)
  }

  deleteDevice (deviceId) {
    this.props.lockboxActions.deleteDevice(deviceId)
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
    .getDeviceName(state, ownProps.deviceId)
    .getOrFail()
})

const mapDispatchToProps = dispatch => ({
  lockboxActions: bindActionCreators(actions.components.lockbox, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DeviceStatusContainer)
