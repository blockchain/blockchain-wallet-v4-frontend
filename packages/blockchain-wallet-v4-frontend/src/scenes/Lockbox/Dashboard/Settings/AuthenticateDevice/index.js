import React from 'react'
import { actions, model } from 'data'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'

import AppManager from './template'

const { AUTHENTICATE_DEVICE } = model.analytics.LOCKBOX_EVENTS.SETTINGS
class AuthenticateDeviceContainer extends React.PureComponent {
  onStartCheck = () => {
    this.props.modalActions.showModal('LockboxDeviceAuthenticity', {
      deviceIndex: this.props.deviceIndex
    })
    this.props.analyticsActions.logEvent(AUTHENTICATE_DEVICE)
  }

  render () {
    return (
      <AppManager
        isBrowserChrome={this.props.isBrowserChrome}
        onStartCheck={this.onStartCheck}
      />
    )
  }
}

AuthenticateDeviceContainer.propTypes = {
  isBrowserChrome: PropTypes.bool.isRequired
}

const mapDispatchToProps = dispatch => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch)
})

export default connect(
  null,
  mapDispatchToProps
)(AuthenticateDeviceContainer)
