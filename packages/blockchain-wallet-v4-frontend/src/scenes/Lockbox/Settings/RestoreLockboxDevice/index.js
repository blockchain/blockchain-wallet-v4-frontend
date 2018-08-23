import React from 'react'
import { actions } from 'data'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import RestoreLockboxDevice from './template.js'

class RestoreLockboxDeviceContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.onClick = this.onClick.bind(this)
  }

  onClick () {
    this.props.modalActions.showModal('LockboxSetup')
  }

  render () {
    return <RestoreLockboxDevice onClick={this.onClick} />
  }
}

const mapDispatchToProps = dispatch => ({
  modalActions: bindActionCreators(actions.modals, dispatch)
})

export default connect(
  null,
  mapDispatchToProps
)(RestoreLockboxDeviceContainer)
