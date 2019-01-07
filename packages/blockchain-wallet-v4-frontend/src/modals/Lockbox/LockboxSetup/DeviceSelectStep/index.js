import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import SetupTypeStep from './template'

class DeviceSelectStepContainer extends React.PureComponent {
  onChangeStep = setupType => {
    this.props.lockboxActions.changeDeviceSetupStep('setup-type')
  }

  render () {
    return (
      <SetupTypeStep handleStepChange={this.onChangeStep} {...this.props} />
    )
  }
}

const mapDispatchToProps = dispatch => ({
  lockboxActions: bindActionCreators(actions.components.lockbox, dispatch)
})

export default connect(
  null,
  mapDispatchToProps
)(DeviceSelectStepContainer)
