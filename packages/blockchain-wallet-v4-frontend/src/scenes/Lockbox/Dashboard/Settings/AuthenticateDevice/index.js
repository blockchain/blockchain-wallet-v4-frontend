import React from 'react'
import { actions } from 'data'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'

import AppManager from './template'

class AuthenticateDeviceContainer extends React.PureComponent {
  onStartCheck = () => {
    this.props.modalActions.showModal('LockboxDeviceAuthenticity', {
      deviceIndex: this.props.deviceIndex
    })
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
  modalActions: bindActionCreators(actions.modals, dispatch)
})

export default connect(
  null,
  mapDispatchToProps
)(AuthenticateDeviceContainer)
