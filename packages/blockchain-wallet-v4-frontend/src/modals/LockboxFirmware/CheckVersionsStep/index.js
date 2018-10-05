import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions, selectors } from 'data'
import CheckVersionsStep from './template'

class CheckVersionsContainer extends React.PureComponent {
  render () {
    const { currentStep } = this.props
    return <CheckVersionsStep status={currentStep.status} />
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
)(CheckVersionsContainer)
