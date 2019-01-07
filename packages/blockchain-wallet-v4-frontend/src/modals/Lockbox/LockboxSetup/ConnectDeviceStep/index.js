import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actions, selectors } from 'data'
import Template from './template'

class ConnectDeviceStepContainer extends React.PureComponent {
  componentDidMount () {
    this.props.lockboxActions.initializeNewDeviceSetup()
  }

  changeDeviceSetupStep = () => {
    this.props.setupType === 'new'
      ? this.props.lockboxActions.changeDeviceSetupStep('customize-device')
      : this.props.lockboxActions.changeDeviceSetupStep('pair-device')
  }

  render () {
    return (
      <Template
        deviceType={this.props.deviceType}
        isConnected={this.props.connection.app}
        isNewSetup={this.props.setupType === 'new'}
        handleStepChange={this.changeDeviceSetupStep}
      />
    )
  }
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
