import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actions, selectors } from 'data'
import Template from './template'

class ConnectDeviceStepContainer extends React.PureComponent {
  componentDidMount () {
    this.props.lockboxActions.initializeNewDeviceSetup()
    this.props.analytics.logLockboxSetup('connect')
  }

  changeDeviceSetupStep = () => {
    this.props.lockboxActions.changeDeviceSetupStep('auth-check')
  }

  render () {
    return (
      <Template
        isConnected={this.props.connection.app}
        handleStepChange={this.changeDeviceSetupStep}
      />
    )
  }
}

const mapStateToProps = state => ({
  connection: selectors.components.lockbox.getCurrentConnection(state)
})

const mapDispatchToProps = dispatch => ({
  analytics: bindActionCreators(actions.analytics, dispatch),
  lockboxActions: bindActionCreators(actions.components.lockbox, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConnectDeviceStepContainer)
