import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { actions } from 'data'
import Setup from './template.js'

class LockboxSetupContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.launchCarbonSetup = this.launchCarbonSetup.bind(this)
  }

  launchCarbonSetup () {
    this.props.modalActions.showModal('LockboxSetup')
  }

  render () {
    return <Setup launchCarbonSetup={this.launchCarbonSetup} />
  }
}

const mapDispatchToProps = dispatch => ({
  modalActions: bindActionCreators(actions.modals, dispatch)
})

export default connect(
  null,
  mapDispatchToProps
)(LockboxSetupContainer)
