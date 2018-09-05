import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions, selectors } from 'data'
import AuthenticityCheckStep from './template'

class AuthenticityCheckStepContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.onNextStep = this.onNextStep.bind(this)
  }

  onNextStep () {
    // reset to initial device add step
    // this.props.lockboxActions.changeDeviceSetupStep('setup-type')
    // this.props.modalActions.closeModal()
  }

  render () {
    const { newDeviceInfo } = this.props

    return (
      <AuthenticityCheckStep
        newDeviceInfo={newDeviceInfo}
        onNextStep={this.onNextStep}
      />
    )
  }
}

const mapStateToProps = state => ({
  newDeviceInfo: selectors.components.lockbox.getNewDeviceInfo(state)
})

const mapDispatchToProps = dispatch => ({
  lockboxActions: bindActionCreators(actions.components.lockbox, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthenticityCheckStepContainer)
