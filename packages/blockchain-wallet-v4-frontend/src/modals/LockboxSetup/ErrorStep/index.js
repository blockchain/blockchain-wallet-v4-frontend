import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import ErrorStep from './template'
import { actions } from 'data'

class ErrorStepContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.handleContinue = this.handleContinue.bind(this)
  }

  handleContinue () {
    // reset to initial device add step
    this.props.lockboxActions.changeDeviceSetupStep('setup-type')
    this.props.modalActions.closeModal()
  }

  render () {
    return <ErrorStep handleContinue={this.handleContinue} />
  }
}
const mapDispatchToProps = dispatch => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  lockboxActions: bindActionCreators(actions.components.lockbox, dispatch)
})

export default connect(
  null,
  mapDispatchToProps
)(ErrorStepContainer)
