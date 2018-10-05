import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import InstallMcu from './template'

class InstallMcuContainer extends React.PureComponent {
  render () {
    const { status } = this.props
    return <InstallMcu status={status} />
  }
}

const mapDispatchToProps = dispatch => ({
  lockboxActions: bindActionCreators(actions.components.lockbox, dispatch)
})

export default connect(
  null,
  mapDispatchToProps
)(InstallMcuContainer)
