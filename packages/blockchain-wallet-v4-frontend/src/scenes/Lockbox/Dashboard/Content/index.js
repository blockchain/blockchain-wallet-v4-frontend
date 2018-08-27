import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { actions } from 'data'
import Content from './template'

class ContentContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.deleteDevice = this.deleteDevice.bind(this)
    this.addDevice = this.addDevice.bind(this)
  }

  addDevice () {
    this.props.modalActions.showModal('LockboxSetup')
  }

  deleteDevice (deviceId) {
    this.props.lockboxActions.deleteDevice(deviceId)
  }

  render () {
    const { devices } = this.props

    return (
      <h1>Content</h1>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  lockboxActions: bindActionCreators(actions.components.lockbox, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch)
})

export default connect(
  null,
  mapDispatchToProps
)(ContentContainer)
