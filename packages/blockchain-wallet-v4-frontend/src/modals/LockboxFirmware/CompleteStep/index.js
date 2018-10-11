import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { withRouter } from 'react-router-dom'

import { actions } from 'data'
import CompleteStep from './template'

class CompleteStepContainer extends React.PureComponent {
  onInstallApps = () => {
    this.props.closeAll()
    const deviceIndex = this.props.match.params.deviceIndex
    this.props.modalActions.showModal('LockboxAppInstall', { deviceIndex })
  }
  render () {
    const { closeAll, status } = this.props
    return (
      <CompleteStep
        closeAll={closeAll}
        status={status}
        onInstallApps={this.onInstallApps}
      />
    )
  }
}

const mapDispatchToProps = dispatch => ({
  lockboxActions: bindActionCreators(actions.components.lockbox, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch)
})

const enhance = compose(
  withRouter,
  connect(
    null,
    mapDispatchToProps
  )
)
export default enhance(CompleteStepContainer)
