import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import PairDeviceStep from './template'
import { actions, selectors } from 'data'

class PairDeviceStepContainer extends React.PureComponent {
  state = { installRanOrSkipped: false, userAcceptedInstall: false }

  componentWillUnmount () {
    this.props.lockboxActions.resetAppChangeStatus()
  }

  onStepChange = () => {
    this.props.lockboxActions.changeDeviceSetupStep('finish-step')
  }

  render () {
    return (
      <PairDeviceStep
        deviceType={this.props.deviceType}
        isReady={this.props.done}
        onInstallApps={this.onInstallApps}
        onStepChange={this.onStepChange}
      />
    )
  }
}

const mapStateToProps = state => ({
  deviceType: selectors.components.lockbox.getNewDeviceType(state)
})

const mapDispatchToProps = dispatch => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  lockboxActions: bindActionCreators(actions.components.lockbox, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PairDeviceStepContainer)
