import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import OpenBtcAppStep from './template'
import { actions } from 'data'

class OpenBtcAppStepContainer extends React.PureComponent {
  state = { installRanOrSkipped: false, userAcceptedInstall: false }

  componentDidMount () {
    this.props.analytics.logLockboxSetup('open_btc')
  }

  componentWillUnmount () {
    this.props.lockboxActions.resetAppChangeStatus()
  }

  onStepChange = () => {
    this.props.lockboxActions.changeDeviceSetupStep('name-device')
  }

  render () {
    return (
      <OpenBtcAppStep
        isReady={this.props.done}
        onInstallApps={this.onInstallApps}
        onStepChange={this.onStepChange}
      />
    )
  }
}

const mapDispatchToProps = dispatch => ({
  analytics: bindActionCreators(actions.analytics, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch),
  lockboxActions: bindActionCreators(actions.components.lockbox, dispatch)
})

export default connect(
  null,
  mapDispatchToProps
)(OpenBtcAppStepContainer)
