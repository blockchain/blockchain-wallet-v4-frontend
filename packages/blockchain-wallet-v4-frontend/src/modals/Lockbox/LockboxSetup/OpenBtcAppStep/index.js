import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actions, selectors } from 'data'
import OpenBtcAppStep from './template.open'
import InstallBtcAppStep from './template.install'

// TODO: clean up in LB2
class OpenBtcAppStepContainer extends React.PureComponent {
  state = { installRanOrSkipped: false, userAcceptedInstall: false }

  componentDidMount () {
    this.props.analytics.logLockboxSetup('open_btc')
  }

  onInstallApps = () => {
    this.props.modalActions.showModal('LockboxAppManager')
  }

  onInstallBtc = () => {
    // this.props.modalActions.showModal('LockboxAppManager')
  }

  onSkipInstall = () => {
    // fake install success to continue setup
    this.props.lockboxActions.appChangeSuccess('BTC', 'install')
    this.setState({ installRanOrSkipped: true })
  }

  onStepChange = () => {
    this.props.lockboxActions.changeDeviceSetupStep('name-device')
  }

  render () {
    const { currentConnection } = this.props

    if (
      currentConnection.deviceType === 'ledger' ||
      this.state.installRanOrSkipped
    ) {
      return (
        <OpenBtcAppStep
          isReady={this.props.done}
          onInstallApps={this.onInstallApps}
          onStepChange={this.onStepChange}
          hideInstallLink={this.state.installRanOrSkipped}
        />
      )
    }
    return (
      <InstallBtcAppStep
        onInstallBtc={this.onInstallBtc}
        onSkipInstall={this.onSkipInstall}
        showInstall={this.state.userAcceptedInstall}
      />
    )
  }
}

const mapStateToProps = state => ({
  currentConnection: selectors.components.lockbox.getCurrentConnection(state)
})

const mapDispatchToProps = dispatch => ({
  analytics: bindActionCreators(actions.analytics, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch),
  lockboxActions: bindActionCreators(actions.components.lockbox, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OpenBtcAppStepContainer)
