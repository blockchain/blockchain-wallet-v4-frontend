import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions, selectors } from 'data'
import SetupTypeStep from './template'

class SetupTypeStepContainer extends React.PureComponent {
  onChangeStep = setupType => {
    this.props.lockboxActions.setSetupNewOrExisting(setupType)
    this.props.lockboxActions.changeDeviceSetupStep('connect-device')
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
  lockboxActions: bindActionCreators(actions.components.lockbox, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SetupTypeStepContainer)
