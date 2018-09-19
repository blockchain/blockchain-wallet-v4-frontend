import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions, selectors } from 'data'
import UpgradeFirmwareStep from './template'

// TODO: either install apps or add messaging for user to do soe
class UpgradeFirmwareContainer extends React.PureComponent {
  render () {
    return <UpgradeFirmwareStep {...this.props} />
  }
}

const mapStateToProps = state => ({
  firmwares: selectors.components.lockbox.getFirmwareVersions(state)
})

const mapDispatchToProps = dispatch => ({
  lockboxActions: bindActionCreators(actions.components.lockbox, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UpgradeFirmwareContainer)
