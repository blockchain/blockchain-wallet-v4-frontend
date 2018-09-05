import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions, selectors } from 'data'
import CheckForUpdatesStep from './template'

class CheckForUpdatesContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.continueOrClose = this.continueOrClose.bind(this)
    this.retryConnection = this.retryConnection.bind(this)
  }

  componentDidMount () {
    this.props.lockboxActions.updateDeviceFirmware(this.props.deviceId)
  }

  continueOrClose () {
    if (this.props.firmwares.latest.deviceOutdated) {
      this.props.lockboxActions.changeFirmwareUpdateStep(
        'upgrade-firmware-step'
      )
    } else {
      this.props.modalActions.closeModal()
    }
  }

  retryConnection () {
    this.props.lockboxActions.pollForDeviceApp('DASHBOARD', this.props.deviceId)
  }

  render () {
    return (
      <CheckForUpdatesStep
        {...this.props}
        continueOrClose={this.continueOrClose}
        retryConnection={this.retryConnection}
      />
    )
  }
}

const mapStateToProps = state => ({
  connection: selectors.components.lockbox.getCurrentConnection(state),
  firmwares: selectors.components.lockbox.getFirmwareVersions(state)
})

const mapDispatchToProps = dispatch => ({
  lockboxActions: bindActionCreators(actions.components.lockbox, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CheckForUpdatesContainer)
