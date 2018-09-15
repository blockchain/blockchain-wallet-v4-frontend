import React from 'react'
import { selectors, actions } from 'data'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import DeviceStatus from './template.js'

class RemoveDeviceContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.deleteDevice = this.deleteDevice.bind(this)
  }

  deleteDevice () {
    this.props.lockboxActions.deleteDevice(this.props.deviceIndex)
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
  lockboxActions: bindActionCreators(actions.components.lockbox, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RemoveDeviceContainer)
