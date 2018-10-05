import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions, selectors } from 'data'
import CheckForUpdatesStep from './template'

class ConnectDeviceContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.onContinue = this.onContinue.bind(this)
    this.retryConnection = this.retryConnection.bind(this)
  }

  onContinue () {
    this.props.lockboxActions.changeFirmwareUpdateStep({
      step: 'check-versions'
    })
  }

  retryConnection () {
    this.props.lockboxActions.pollForDeviceApp(
      'DASHBOARD',
      this.props.deviceIndex
    )
  }

  render () {
    const { connection } = this.props
    return (
      <CheckForUpdatesStep
        {...this.props}
        isOnDashboard={connection.app === 'DASHBOARD'}
        onContinue={this.onContinue}
        retryConnection={this.retryConnection}
      />
    )
  }
}

const mapStateToProps = state => ({
  connection: selectors.components.lockbox.getCurrentConnection(state)
})

const mapDispatchToProps = dispatch => ({
  lockboxActions: bindActionCreators(actions.components.lockbox, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConnectDeviceContainer)
