import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'

import PairDeviceStep from './template'
import { actions, selectors } from 'data'

class PairDeviceStepContainer extends React.PureComponent {
  state = { btcOpenTimeout: false }

  componentDidMount () {
    this.startBtcOpenTimeout()
  }

  onStepChange = requestedStep => {
    this.props.lockboxActions.changeDeviceSetupStep(requestedStep)
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
    }, 120000)
  }

  render () {
    const { deviceType, done, supportLink } = this.props

    return (
      <PairDeviceStep
        btcOpenTimeout={this.state.btcOpenTimeout}
        deviceType={deviceType}
        isReady={done}
        onTimeoutAccept={this.onTimeoutAccept}
        onStepChange={this.onStepChange}
        supportLink={supportLink}
      />
    )
  }
}

PairDeviceStepContainer.propTypes = {
  supportLink: PropTypes.string.isRequired
}

const mapStateToProps = state => ({
  deviceType: selectors.components.lockbox.getNewDeviceType(state)
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
