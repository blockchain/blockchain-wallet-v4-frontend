import React from 'react'
import { actions, model } from 'data'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'

import AddDevice from './template'

const { ADD_DEVICE } = model.analytics.LOCKBOX_EVENTS.SETTINGS
class AddDeviceContainer extends React.PureComponent {
  onClick = () => {
    this.props.lockboxActions.changeDeviceSetupStep('device-select')
    this.props.modalActions.showModal('LockboxSetup')
    this.props.analyticsActions.logEvent(ADD_DEVICE)
  }

  render () {
    return (
      <AddDevice
        onClick={this.onClick}
        isBrowserSupported={this.props.isBrowserSupported}
      />
    )
  }
}

const mapDispatchToProps = dispatch => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  lockboxActions: bindActionCreators(actions.components.lockbox, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch)
})

AddDeviceContainer.propTypes = {
  isBrowserSupported: PropTypes.bool.isRequired
}

export default connect(
  null,
  mapDispatchToProps
)(AddDeviceContainer)
