import React from 'react'
import { actions } from 'data'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import UpdateDevice from './template.js'

class UpdateDeviceContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.onStartUpgrade = this.onStartUpgrade.bind(this)
  }

  onStartUpgrade () {
    this.props.modalActions.showModal('ConnectLockboxDevice', {
      appRequested: 'DASHBOARD',
      deviceId: this.props.deviceId
    })
  }

  render () {
    return <UpdateDevice onStartUpgrade={this.onStartUpgrade} />
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
