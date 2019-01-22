import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'

import { SETUP_TIMEOUT } from './../model'
import { actions, selectors } from 'data'
import Template from './template'

class ConnectDeviceStepContainer extends React.PureComponent {
  state = { connectTimeout: false }

  componentDidMount () {
    this.props.lockboxActions.initializeNewDeviceSetup()
    this.startConnectionTimeout()
  }

  changeDeviceSetupStep = () => {
    this.props.setupType === 'new'
      ? this.props.lockboxActions.changeDeviceSetupStep('customize-device')
      : this.props.lockboxActions.changeDeviceSetupStep('pair-device')
  }

  onTimeoutAccept = () => {
    this.setState({ connectTimeout: false })
    this.startConnectionTimeout()
  }

  // 15 minute setup timeout
  startConnectionTimeout = () => {
    setTimeout(() => {
      this.setState({ connectTimeout: true })
    }, SETUP_TIMEOUT)
  }

  render () {
    const { deviceType, connection, setupType, supportLink } = this.props

    return (
      <Template
        connectTimeout={this.state.connectTimeout}
        deviceType={deviceType}
        isConnected={connection.app}
        isNewSetup={setupType === 'new'}
        handleStepChange={this.changeDeviceSetupStep}
        onTimeoutAccept={this.onTimeoutAccept}
        supportLink={supportLink}
      />
    )
  }
}

ConnectDeviceStepContainer.propTypes = {
  supportLink: PropTypes.string.isRequired
}

const mapStateToProps = state => ({
  connection: selectors.components.lockbox.getCurrentConnection(state),
  setupType: selectors.components.lockbox.getNewDeviceSetupType(state),
  deviceType: selectors.components.lockbox.getNewDeviceType(state)
})

const mapDispatchToProps = dispatch => ({
  lockboxActions: bindActionCreators(actions.components.lockbox, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConnectDeviceStepContainer)
