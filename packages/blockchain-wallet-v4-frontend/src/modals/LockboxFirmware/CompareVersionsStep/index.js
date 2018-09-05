import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions, selectors } from 'data'
import CompareVersions from './template'

class CompareVersionsContainer extends React.PureComponent {
  render () {
    return <CompareVersions {...this.props} />
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
)(CompareVersionsContainer)
