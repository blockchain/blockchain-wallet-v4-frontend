import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { actions } from 'data'

class LockboxContainer extends React.PureComponent {
  componentWillMount() {
    this.props.lockboxActions.determineLockboxRoute()
  }

  render () {
    return null
  }
}

const mapDispatchToProps = dispatch => ({
  lockboxActions: bindActionCreators(actions.components.lockbox, dispatch)
})

export default connect(
  null,
  mapDispatchToProps
)(LockboxContainer)
