import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actions } from 'data'

import CustomizeStep from './template'

class CustomizeStepContainer extends React.PureComponent {
  onNextStep = () => {
    this.props.lockboxActions.changeDeviceSetupStep('app-manager-step')
  }

  render () {
    return <CustomizeStep onNextStep={this.onNextStep} />
  }
}

const mapDispatchToProps = dispatch => ({
  lockboxActions: bindActionCreators(actions.components.lockbox, dispatch)
})

export default connect(
  null,
  mapDispatchToProps
)(CustomizeStepContainer)
