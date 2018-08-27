import React from 'react'
import { actions } from 'data'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import FirmwareUpdate from './template.js'

class FirmwareUpdateContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.onClick = this.onClick.bind(this, props.deviceId)
  }

  onClick (deviceId) {
    // TODO implement
  }

  render () {
    return <FirmwareUpdate onClick={this.onClick} />
  }
}

const mapDispatchToProps = dispatch => ({
  lockboxActions: bindActionCreators(actions.components.lockbox, dispatch)
})

export default connect(
  null,
  mapDispatchToProps
)(FirmwareUpdateContainer)
