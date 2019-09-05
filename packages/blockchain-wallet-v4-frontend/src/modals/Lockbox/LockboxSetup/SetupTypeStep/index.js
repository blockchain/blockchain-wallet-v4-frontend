import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { equals } from 'ramda'

import { actions, model, selectors } from 'data'
import SetupTypeStep from './template'

const { SETUP_TYPE } = model.analytics.LOCKBOX_EVENTS.DEVICE_SETUP
class SetupTypeStepContainer extends React.PureComponent {
  onChangeStep = setupType => {
    this.props.lockboxActions.setSetupNewOrExisting(setupType)
    if (equals('existing', setupType)) {
      this.props.lockboxActions.changeDeviceSetupStep('software-download')
    } else {
      this.props.lockboxActions.changeDeviceSetupStep('connect-device')
    }
    this.props.analyticsActions.logEvent([...SETUP_TYPE, setupType])
  }

  render () {
    return (
      <SetupTypeStep
        handleStepChange={this.onChangeStep}
        deviceType={this.props.setupDeviceType}
      />
    )
  }
}

const mapStateToProps = state => ({
  setupDeviceType: selectors.components.lockbox.getNewDeviceType(state)
})

const mapDispatchToProps = dispatch => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  lockboxActions: bindActionCreators(actions.components.lockbox, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SetupTypeStepContainer)
