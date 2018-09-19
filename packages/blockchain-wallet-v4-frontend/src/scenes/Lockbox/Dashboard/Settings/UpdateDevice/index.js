import React from 'react'
import { actions } from 'data'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import UpdateDevice from './template.js'

class UpdateDeviceContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.onCheckForUpdates = this.onCheckForUpdates.bind(this)
  }

  onCheckForUpdates () {
    this.props.modalActions.showModal('LockboxFirmware', {
      deviceIndex: this.props.deviceIndex
    })
  }

  render () {
    return <UpdateDevice onCheckForUpdates={this.onCheckForUpdates} />
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
