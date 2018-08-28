import React from 'react'
import { actions } from 'data'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import UpdateDevice from './template.js'

class UpdateDeviceContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.onClick = this.onClick.bind(this, props.deviceId)
  }

  onClick () {
    this.props.modalActions.showModal('LockboxFirmware')
  }

  render () {
    return <UpdateDevice onClick={this.onClick} />
  }
}

const mapDispatchToProps = dispatch => ({
  modalActions: bindActionCreators(actions.modals, dispatch)
})

export default connect(
  null,
  mapDispatchToProps
)(UpdateDeviceContainer)
