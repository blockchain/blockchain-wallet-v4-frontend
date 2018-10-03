import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions, selectors } from 'data'
import CheckVersionsStep from './template'

class CheckVersionsContainer extends React.PureComponent {
  render () {
    return <CheckVersionsStep {...this.props} />
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
)(CheckVersionsContainer)
