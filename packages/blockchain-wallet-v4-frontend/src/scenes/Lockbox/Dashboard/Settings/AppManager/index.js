import React from 'react'
import { actions } from 'data'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'

import AppManager from './template'

class AppManagerContainer extends React.PureComponent {
  onInstallClick = () => {
    const deviceIndex = this.props.deviceIndex
    this.props.modalActions.showModal('LockboxAppManager', { deviceIndex })
  }

  render () {
    return (
      <AppManager
        onInstallClick={this.onInstallClick}
        isBrowserChrome={this.props.isBrowserChrome}
      />
    )
  }
}

AppManagerContainer.propTypes = {
  isBrowserChrome: PropTypes.bool.isRequired
}

const mapDispatchToProps = dispatch => ({
  modalActions: bindActionCreators(actions.modals, dispatch)
})

export default connect(
  null,
  mapDispatchToProps
)(AppManagerContainer)
