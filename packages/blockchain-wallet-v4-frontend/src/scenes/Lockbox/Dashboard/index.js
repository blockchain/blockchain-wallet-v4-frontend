import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { keysIn } from 'ramda'

import { actions } from 'data'
import Dashboard from './template.js'

class LockboxDashboardContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.deleteDevice = this.deleteDevice.bind(this)
  }

  deleteDevice () {
    // TODO: send better current device context
    this.props.lockboxActions.deleteDevice(keysIn(this.props.devices)[0])
  }

  render () {
    const { devices } = this.props
    const deviceId = keysIn(this.props.devices)[0]
    return (
      <Dashboard
        deleteDevice={this.deleteDevice}
        deviceId={deviceId}
        deviceName={devices[deviceId].deviceName}
      />
    )
  }
}

const mapDispatchToProps = dispatch => ({
  lockboxActions: bindActionCreators(actions.components.lockbox, dispatch)
})

export default connect(
  null,
  mapDispatchToProps
)(LockboxDashboardContainer)
