import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { actions } from 'data'
import Setup from './template.js'

class OnboardContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.launchLockboxSetup = this.launchLockboxSetup.bind(this)
  }

  launchLockboxSetup () {
    this.props.modalActions.showModal('LockboxSetup')
  }

  render () {
    return <Setup launchLockboxSetup={this.launchLockboxSetup} />
  }
}

const mapDispatchToProps = dispatch => ({
  modalActions: bindActionCreators(actions.modals, dispatch)
})

export default connect(
  null,
  mapDispatchToProps
)(OnboardContainer)
