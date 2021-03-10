import React from 'react'
import { connect } from 'react-redux'
import ReactTooltip from 'react-tooltip'
import PropTypes from 'prop-types'
import { equals } from 'ramda'
import { bindActionCreators } from 'redux'

import { actions, selectors } from 'data'

import { OPEN_BTC_TIMEOUT } from './../model'
import PairDeviceStep from './template'

class PairDeviceStepContainer extends React.PureComponent {
  state = { btcOpenTimeout: false }

  componentDidMount() {
    if (equals('existing', this.props.setupType)) {
      this.props.lockboxActions.finalizeNewDeviceSetup()
    }
    this.startBtcOpenTimeout()
  }

  componentWillUnmount() {
    ReactTooltip.hide()
  }

  onGoToAppManager = () => {
    this.props.lockboxActions.changeDeviceSetupStep('app-manager-step')
  }

  onTimeoutAccept = () => {
    this.setState({ btcOpenTimeout: false })
    this.startBtcOpenTimeout()
    this.props.formActions.reset('pairLockboxChecklist')
  }

  // 2 minute app timeout
  startBtcOpenTimeout = () => {
    setTimeout(() => {
      this.setState({ btcOpenTimeout: true })
    }, OPEN_BTC_TIMEOUT)
  }

  render() {
    const { deviceType, showBtcWarning, supportLink } = this.props

    return (
      <PairDeviceStep
        btcOpenTimeout={this.state.btcOpenTimeout}
        deviceType={deviceType}
        onTimeoutAccept={this.onTimeoutAccept}
        onGoToAppManager={this.onGoToAppManager}
        supportLink={supportLink}
        showBtcWarning={showBtcWarning}
      />
    )
  }
}

PairDeviceStepContainer.propTypes = {
  supportLink: PropTypes.string.isRequired
}

const mapStateToProps = state => ({
  showBtcWarning: selectors.components.lockbox.getNewDeviceShowBtcWarning(
    state
  ),
  deviceType: selectors.components.lockbox.getNewDeviceType(state),
  setupType: selectors.components.lockbox.getNewDeviceSetupType(state)
})

const mapDispatchToProps = dispatch => ({
  formActions: bindActionCreators(actions.form, dispatch),
  lockboxActions: bindActionCreators(actions.components.lockbox, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PairDeviceStepContainer)
