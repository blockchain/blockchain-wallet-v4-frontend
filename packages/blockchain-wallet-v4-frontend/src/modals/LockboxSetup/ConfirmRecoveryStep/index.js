import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import ConfirmRecoveryStep from './template'

class ConfirmRecoveryStepContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
  }

  onSubmit () {
    this.props.lockboxActions.saveNewDeviceKvStore()
  }

  render () {
    return <ConfirmRecoveryStep onSubmit={this.onSubmit} />
  }
}

const mapDispatchToProps = dispatch => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  lockboxActions: bindActionCreators(actions.components.lockbox, dispatch)
})

export default connect(
  null,
  mapDispatchToProps
)(ConfirmRecoveryStepContainer)
