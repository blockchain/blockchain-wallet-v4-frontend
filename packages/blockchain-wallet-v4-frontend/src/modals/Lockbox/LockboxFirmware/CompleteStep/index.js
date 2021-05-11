import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { bindActionCreators, compose } from 'redux'

import { actions } from 'data'

import CompleteStep from './template'

class CompleteStepContainer extends React.PureComponent {
  onInstallApps = () => {
    this.props.onClose()
    const deviceIndex = this.props.match.params.deviceIndex
    this.props.modalActions.showModal('LockboxAppManager', { deviceIndex })
  }

  render() {
    return (
      <CompleteStep
        status={this.props.status}
        onInstallApps={this.onInstallApps}
      />
    )
  }
}

const mapDispatchToProps = dispatch => ({
  lockboxActions: bindActionCreators(actions.components.lockbox, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch)
})

const enhance = compose(withRouter, connect(null, mapDispatchToProps))
export default enhance(CompleteStepContainer)
