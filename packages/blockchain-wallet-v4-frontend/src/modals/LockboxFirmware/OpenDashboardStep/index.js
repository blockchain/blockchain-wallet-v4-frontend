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
    const { deviceId } = this.props
    this.props.lockboxActions.pollForDeviceApp('DASHBOARD', deviceId)
  }

  retryConnection () {
    this.props.lockboxActions.pollForDeviceApp(
      this.props.appRequested,
      this.props.deviceId
    )
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
  connectionStatus: selectors.components.lockbox.getConnectionStatus(state)
})

const mapDispatchToProps = dispatch => ({
  lockboxActions: bindActionCreators(actions.components.lockbox, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConnectLockboxDeviceContainer)
