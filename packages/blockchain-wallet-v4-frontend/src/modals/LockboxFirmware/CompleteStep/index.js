import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions, selectors } from 'data'
import CompleteStep from './template'

class CompleteStepContainer extends React.PureComponent {
  render () {
    const { closeAll, currentStep } = this.props
    return <CompleteStep closeAll={closeAll} status={currentStep.status} />
  }
}

const mapStateToProps = state => ({
  currentStep: selectors.components.lockbox.getFirmwareUpdateStep(state)
})

const mapDispatchToProps = dispatch => ({
  lockboxActions: bindActionCreators(actions.components.lockbox, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CompleteStepContainer)
