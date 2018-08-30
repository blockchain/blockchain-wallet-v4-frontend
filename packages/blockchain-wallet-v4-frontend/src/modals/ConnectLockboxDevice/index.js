import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'

import { actions, selectors } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'
import ConnectLockboxDevice from './template'

// TODO: this should probably be it's own component that isn't inherently a modal
// that way we could load this component inside existing modals (send modal)
// of course this modal should still exist and wrap the new component
class ConnectLockboxDeviceContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.retryConnection = this.retryConnection.bind(this)
  }

  componentDidMount () {
    const { appRequested, deviceId } = this.props
    this.props.lockboxActions.pollForDevice(appRequested, deviceId)
  }

  retryConnection () {
    this.props.lockboxActions.pollForDevice(
      this.props.appRequested,
      this.props.deviceId
    )
  }

  render () {
    return (
      <ConnectLockboxDevice
        {...this.props}
        retryConnection={this.retryConnection}
      />
    )
  }
}

const mapStateToProps = state => ({
  connectionStatus: selectors.components.lockbox.getConnectionStatus(state)
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
