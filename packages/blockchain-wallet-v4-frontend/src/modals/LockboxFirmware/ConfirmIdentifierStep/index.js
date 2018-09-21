import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions, selectors } from 'data'
import ConfirmIdentifier from './template'

class ConfirmIdentifierContainer extends React.PureComponent {
  render () {
    return <ConfirmIdentifier {...this.props} />
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
)(ConfirmIdentifierContainer)
