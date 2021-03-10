import React from 'react'
import { connect } from 'react-redux'
import { equals } from 'ramda'
import { bindActionCreators } from 'redux'

import { actions, selectors } from 'data'

import SetupTypeStep from './template'

class SetupTypeStepContainer extends React.PureComponent {
  onChangeStep = setupType => {
    this.props.lockboxActions.setSetupNewOrExisting(setupType)
    if (equals('existing', setupType)) {
      this.props.lockboxActions.changeDeviceSetupStep('software-download')
    } else {
      this.props.lockboxActions.changeDeviceSetupStep('connect-device')
    }
  }

  render() {
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
