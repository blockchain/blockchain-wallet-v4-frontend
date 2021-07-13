import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions, selectors } from 'data'

import CheckForUpdatesStep from './template'

class ConnectDeviceContainer extends React.PureComponent {
  retryConnection = () => {
    this.props.lockboxActions.pollForDeviceApp(
      'DASHBOARD',
      this.props.deviceIndex
    )
  }

  render() {
    return (
      <CheckForUpdatesStep
        {...this.props}
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
