import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions, model } from 'data'
import SetupTypeStep from './template'

const { SELECT_DEVICE } = model.analytics.LOCKBOX_EVENTS.DEVICE_SETUP

class DeviceSelectStepContainer extends React.PureComponent {
  onChangeStep = deviceType => {
    this.props.lockboxActions.setDeviceSetupType(
      deviceType === 'ledger' ? 'Nano S' : 'Lockbox'
    )
    this.props.lockboxActions.changeDeviceSetupStep('setup-type')
    this.props.analyticsActions.logEvent([...SELECT_DEVICE, deviceType])
  }

  handleRestoreClick = () => {
    let restoreWindow = window.open('', '_blank')
    restoreWindow.opener = null
    restoreWindow.location = this.props.restoreDeviceLink
    restoreWindow.focus()
  }

  render () {
    return (
      <SetupTypeStep
        handleStepChange={this.onChangeStep}
        handleRestoreClick={this.handleRestoreClick}
      />
    )
  }
}

const mapDispatchToProps = dispatch => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  lockboxActions: bindActionCreators(actions.components.lockbox, dispatch)
})

export default connect(
  null,
  mapDispatchToProps
)(DeviceSelectStepContainer)
