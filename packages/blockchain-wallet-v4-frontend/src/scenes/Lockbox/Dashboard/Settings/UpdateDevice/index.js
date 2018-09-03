import React from 'react'
import { actions } from 'data'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import UpdateDevice from './template.js'

class UpdateDeviceContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.onStartUpdate = this.onStartUpdate.bind(this)
  }

  // TODO: need deviceID logic for when device is not connected
  onStartUpdate () {
    this.props.modalActions.showModal('LockboxFirmware', {
      deviceId: this.props.deviceId
    })
  }

  render () {
    return <UpdateDevice onStartUpdate={this.onStartUpdate} />
  }
}

const mapDispatchToProps = dispatch => ({
  lockboxActions: bindActionCreators(actions.components.lockbox, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch)
})

export default connect(
  null,
  mapDispatchToProps
)(UpdateDeviceContainer)
