import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { actions } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'

import ConnectLockboxDevice from './template'

// TODO: this should probably be it's own component that isn't inherently a modal
// that way we could load this component inside existing modals (send modal)
// of course this modal should still exist and wrap the new component
class ConnectLockboxDeviceContainer extends React.PureComponent {
  componentDidMount () {
    const { app, deviceId } = this.props
    this.props.lockboxActions.connectDevice(app, deviceId)
  }

  render () {
    return <ConnectLockboxDevice {...this.props} />
  }
}

const mapStateToProps = state => ({
  // status: getDeviceNames(state)
})

const mapDispatchToProps = dispatch => ({
  lockboxActions: bindActionCreators(actions.components.lockbox, dispatch)
})

const enhance = compose(
  modalEnhancer('ConnectLockboxDevice'),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)

export default enhance(ConnectLockboxDeviceContainer)
