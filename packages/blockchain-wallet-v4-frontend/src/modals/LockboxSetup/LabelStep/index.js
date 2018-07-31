import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actions } from 'data'

import Template from './template'

class LabelStep extends React.PureComponent {
  render () {
    return <Template {...this.props} />
  }
}

const mapDispatchToProps = dispatch => ({
  lockboxActions: bindActionCreators(actions.components.lockbox, dispatch)
})

export default connect(
  null,
  mapDispatchToProps
)(LabelStep)
