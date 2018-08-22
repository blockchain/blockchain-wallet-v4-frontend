import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import Template from './template'

class SetupTypeStep extends React.PureComponent {
  constructor (props) {
    super(props)
    this.changeDeviceSetupStep = this.changeDeviceSetupStep.bind(this)
  }

  changeDeviceSetupStep () {
    this.props.lockboxActions.changeDeviceSetupStep('connect')
  }

  render () {
    return (
      <Template handleStepChange={this.changeDeviceSetupStep} {...this.props} />
    )
  }
}

const mapDispatchToProps = dispatch => ({
  lockboxActions: bindActionCreators(actions.components.lockbox, dispatch)
})

export default connect(
  null,
  mapDispatchToProps
)(SetupTypeStep)
