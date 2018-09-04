import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions, selectors } from 'data'
import ConnectLockboxDevice from './template'

class ConnectLockboxDeviceContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.retryConnection = this.retryConnection.bind(this)
  }

  componentDidMount () {
    this.props.lockboxActions.updateDeviceFirmware(this.props.deviceId)
  }

  retryConnection () {
    this.props.lockboxActions.pollForDeviceApp('DASHBOARD', this.props.deviceId)
  }

  render () {
    return (
      <ConnectLockboxDevice
        {...this.props}
        retryConnection={this.retryConnection}
      />
    )
  }
}

const mapStateToProps = state => ({
  connectionInfo: selectors.components.lockbox.getCurrentConnection(state)
})

const mapDispatchToProps = dispatch => ({
  lockboxActions: bindActionCreators(actions.components.lockbox, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConnectLockboxDeviceContainer)
