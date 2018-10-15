import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import OpenBtcAppStep from './template'

class OpenBtcAppStepContainer extends React.PureComponent {
  onInstallApps = () => {
    // TODO: reset setup type?
    this.props.modalActions.showModal('LockboxAppInstall')
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
  modalActions: bindActionCreators(actions.modals, dispatch),
  lockboxActions: bindActionCreators(actions.components.lockbox, dispatch)
})

export default connect(
  null,
  mapDispatchToProps
)(OpenBtcAppStepContainer)
