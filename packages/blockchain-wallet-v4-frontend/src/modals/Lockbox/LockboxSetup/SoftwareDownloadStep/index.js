import React from 'react'
import { connect } from 'react-redux'
import { equals } from 'ramda'
import { bindActionCreators } from 'redux'

import { actions, selectors } from 'data'

import SoftwareDownloadStep from './template'

class SoftwareDownloadContainer extends React.PureComponent {
  state = { hasDownloaded: false }

  onStepChange = () => {
    if (equals('existing', this.props.setupType)) {
      this.props.lockboxActions.changeDeviceSetupStep('connect-device')
    } else {
      this.props.lockboxActions.changeDeviceSetupStep('pair-device')
      this.props.lockboxActions.finalizeNewDeviceSetup()
    }
  }
  onSkipDownload = () => {
    if (equals('existing', this.props.setupType)) {
      this.props.lockboxActions.changeDeviceSetupStep('connect-device')
    } else {
      this.props.lockboxActions.changeDeviceSetupStep('pair-device')
      this.props.lockboxActions.finalizeNewDeviceSetup()
    }
  }

  render() {
    return (
      <SoftwareDownloadStep
        hasDownloaded={this.state.hasDownloaded}
        onGoBackToDownload={() => this.setState({ hasDownloaded: false })}
        onStartDownload={() => this.setState({ hasDownloaded: true })}
        onStepChange={this.onStepChange}
        onSkipDownload={this.onSkipDownload}
      />
    )
  }
}

const mapStateToProps = state => ({
  setupType: selectors.components.lockbox.getNewDeviceSetupType(state)
})

const mapDispatchToProps = dispatch => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  lockboxActions: bindActionCreators(actions.components.lockbox, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SoftwareDownloadContainer)
