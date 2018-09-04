import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions, selectors } from 'data'
import CompareVersions from './template'

class CompareVersionsContainer extends React.PureComponent {
  // constructor (props) {
  //   super(props)
  //   this.retryConnection = this.retryConnection.bind(this)
  // }

  componentDidMount () {
    // this.props.lockboxActions.updateDeviceFirmware(this.props.deviceId)
  }

  render () {
    return (
      <CompareVersions {...this.props} />
    )
  }
}

const mapStateToProps = state => ({
  connectionInfo: selectors.components.lockbox.getCurrentConnection(state)
})

const mapDispatchToProps = dispatch => ({
  lockboxActions: bindActionCreators(actions.components.lockbox, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CompareVersionsContainer)
