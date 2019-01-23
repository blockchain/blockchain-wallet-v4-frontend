import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { actions } from 'data'
import Setup from './template'

class OnboardContainer extends React.PureComponent {
  launchLockboxSetup = () => {
    this.props.modalActions.showModal('LockboxSetup')
  }

  render () {
    return <Setup launchLockboxSetup={this.launchLockboxSetup} />
  }
}

const mapDispatchToProps = dispatch => ({
  lockboxActions: bindActionCreators(actions.components.lockbox, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch)
})

export default connect(
  null,
  mapDispatchToProps
)(OnboardContainer)
