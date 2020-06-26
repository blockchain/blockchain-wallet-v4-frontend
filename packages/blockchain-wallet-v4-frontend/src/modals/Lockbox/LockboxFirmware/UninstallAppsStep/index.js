import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import React from 'react'

import { actions, selectors } from 'data'
import UninstallApps from './template'

class UninstallAppsContainer extends React.PureComponent {
  render () {
    return <UninstallApps {...this.props} />
  }
}

const mapStateToProps = state => ({
  step: selectors.components.lockbox.getFirmwareUpdateStep(state)
})

const mapDispatchToProps = dispatch => ({
  lockboxActions: bindActionCreators(actions.components.lockbox, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UninstallAppsContainer)
