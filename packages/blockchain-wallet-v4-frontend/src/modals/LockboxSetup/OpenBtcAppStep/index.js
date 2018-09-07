import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import OpenBtcAppStep from './template'

class OpenBtcAppStepContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.changeDeviceSetupStep = this.changeDeviceSetupStep.bind(this)
  }

  changeDeviceSetupStep () {
    this.props.lockboxActions.changeDeviceSetupStep('name-device')
  }

  render () {
    return (
      <OpenBtcAppStep
        isReady={this.props.done}
        handleStepChange={this.changeDeviceSetupStep}
      />
    )
  }
}

const mapDispatchToProps = dispatch => ({
  lockboxActions: bindActionCreators(actions.components.lockbox, dispatch)
})

export default connect(
  null,
  mapDispatchToProps
)(OpenBtcAppStepContainer)
