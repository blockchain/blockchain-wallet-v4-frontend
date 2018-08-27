import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actions } from 'data'

import Template from './template'

class ConnectDeviceStepContainer extends React.PureComponent {
  componentDidMount () {
    this.props.lockboxActions.initializeNewDeviceSetup()
  }

  render () {
    return <Template />
  }
}

const mapDispatchToProps = dispatch => ({
  lockboxActions: bindActionCreators(actions.components.lockbox, dispatch)
})

export default connect(
  null,
  mapDispatchToProps
)(ConnectDeviceStepContainer)
