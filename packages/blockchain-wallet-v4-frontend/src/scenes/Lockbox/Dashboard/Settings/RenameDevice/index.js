import React from 'react'
import { selectors } from 'data'
import { connect } from 'react-redux'

import RenameDevice from './template.js'

class RenameDeviceContainer extends React.PureComponent {
  render () {
    return <RenameDevice {...this.props} />
  }
}

const mapStateToProps = (state, ownProps) => ({
  deviceName: selectors.core.kvStore.lockbox
    .getDeviceName(state, ownProps.deviceIndex)
    .getOrFail()
})

export default connect(
  mapStateToProps,
  null
)(RenameDeviceContainer)
