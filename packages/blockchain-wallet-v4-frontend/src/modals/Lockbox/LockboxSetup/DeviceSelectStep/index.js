import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'

import SetupTypeStep from './template'

class DeviceSelectStepContainer extends React.PureComponent {
  onChangeStep = deviceType => {
    this.props.lockboxActions.setDeviceSetupType(
      deviceType === 'ledger' ? 'Nano S' : 'Lockbox'
    )
    this.props.lockboxActions.changeDeviceSetupStep('setup-type')
  }

  handleRestoreClick = () => {
    let restoreWindow = window.open('', '_blank')
    restoreWindow.opener = null
    restoreWindow.location = this.props.restoreDeviceLink
    restoreWindow.focus()
  }

  render() {
    return (
      <SetupTypeStep
        handleStepChange={this.onChangeStep}
        handleRestoreClick={this.handleRestoreClick}
      />
    )
  }
}

const mapDispatchToProps = dispatch => ({
  lockboxActions: bindActionCreators(actions.components.lockbox, dispatch)
})

export default connect(null, mapDispatchToProps)(DeviceSelectStepContainer)
