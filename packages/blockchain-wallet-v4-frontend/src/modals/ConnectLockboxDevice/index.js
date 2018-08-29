import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { actions } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'

import ConnectLockboxDevice from './template'

class ConnectLockboxDeviceContainer extends React.PureComponent {
  componentDidMount () {
    this.props.lockboxActions.connectDevice(this.props.app)
  }

  render () {
    return <ConnectLockboxDevice {...this.props} />
  }
}

const mapDispatchToProps = dispatch => ({
  lockboxActions: bindActionCreators(actions.components.lockbox, dispatch)
})

const enhance = compose(
  modalEnhancer('ConnectLockboxDevice'),
  connect(
    undefined,
    mapDispatchToProps
  )
)

export default enhance(ConnectLockboxDeviceContainer)
