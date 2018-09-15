import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions, selectors } from 'data'
import AuthenticityError from './authenticity.template'
import DuplicateError from './duplicate.template'

class ErrorStepContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.handleContinue = this.handleContinue.bind(this)
  }

  handleContinue () {
    this.props.modalActions.closeModal()
  }

  render () {
    const { step } = this.props

    return step.error === 'authenticity' ? (
      <AuthenticityError handleContinue={this.handleContinue} />
    ) : (
      <DuplicateError handleContinue={this.handleContinue} />
    )
  }
}

const mapStateToProps = state => ({
  step: selectors.components.lockbox.getNewDeviceSetupStep(state)
})

const mapDispatchToProps = dispatch => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  lockboxActions: bindActionCreators(actions.components.lockbox, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ErrorStepContainer)
