import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actions, selectors } from 'data'
import Template from './template'

class ConnectDeviceStepContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.changeDeviceSetupStep = this.changeDeviceSetupStep.bind(this)
  }

  componentDidMount () {
    this.props.lockboxActions.initializeNewDeviceSetup()
  }

  changeDeviceSetupStep () {
    this.props.lockboxActions.changeDeviceSetupStep('auth-check')
  }

  render () {
    const isConnected = this.props.connection.app === 'DASHBOARD'

    return (
      <Template
        isConnected={isConnected}
        handleStepChange={this.changeDeviceSetupStep}
      />
    )
  }
}

const mapStateToProps = state => ({
  connection: selectors.components.lockbox.getCurrentConnection(state)
})

const mapDispatchToProps = dispatch => ({
  lockboxActions: bindActionCreators(actions.components.lockbox, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConnectDeviceStepContainer)
