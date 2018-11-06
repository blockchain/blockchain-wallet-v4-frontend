import React from 'react'
import { actions } from 'data'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'

import InstallApps from './template.js'

class InstallAppsContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.onInstallClick = this.onInstallClick.bind(this)
  }

  onInstallClick () {
    const deviceIndex = this.props.deviceIndex
    this.props.modalActions.showModal('LockboxAppManager', { deviceIndex })
  }

  render () {
    return (
      <InstallApps
        onInstallClick={this.onInstallClick}
        isBrowserChrome={this.props.isBrowserChrome}
      />
    )
  }
}

InstallAppsContainer.propTypes = {
  isBrowserChrome: PropTypes.bool.isRequired
}

const mapDispatchToProps = dispatch => ({
  modalActions: bindActionCreators(actions.modals, dispatch)
})

export default connect(
  null,
  mapDispatchToProps
)(InstallAppsContainer)
