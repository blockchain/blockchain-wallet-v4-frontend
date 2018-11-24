import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actions, selectors } from 'data'
import Template from './template'

class AuthenticityStepContainer extends React.PureComponent {
  componentDidMount () {
    this.props.analytics.logLockboxSetup('verify_device')
  }

  changeDeviceSetupStep = () => {
    this.props.setupType === 'new'
      ? this.props.lockboxActions.changeDeviceSetupStep('install-btc-app')
      : this.props.lockboxActions.changeDeviceSetupStep('open-btc-app')
  }

  render () {
    const authenticity = this.props.authenticity.cata({
      Success: res => ({
        isAuthenticating: false,
        isAuthentic: res.isAuthentic
      }),
      Failure: () => ({ isAuthenticating: false }),
      Loading: () => ({ isAuthenticating: true }),
      NotAsked: () => ({ isAuthenticating: true })
    })

    return (
      <Template
        authenticity={authenticity}
        handleStepChange={this.changeDeviceSetupStep}
      />
    )
  }
}

const mapStateToProps = state => ({
  authenticity: selectors.components.lockbox.getNewDeviceAuthenticity(state),
  setupType: selectors.components.lockbox.getNewDeviceSetupType(state)
})

const mapDispatchToProps = dispatch => ({
  analytics: bindActionCreators(actions.analytics, dispatch),
  lockboxActions: bindActionCreators(actions.components.lockbox, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthenticityStepContainer)
