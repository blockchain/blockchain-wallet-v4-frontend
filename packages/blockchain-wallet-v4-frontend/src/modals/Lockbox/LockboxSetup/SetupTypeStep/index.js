import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import SetupTypeStep from './template'

class SetupTypeStepContainer extends React.PureComponent {
  onChangeStep = (setupType) => {
    this.props.lockboxActions.changeDeviceSetupStep('connect-device')
    this.props.lockboxActions.setDeviceSetupType(setupType)
  }

  openSupportLink = () => {
    window.open('https://support.blockchain.com/hc/en-us/articles/360018285872')
  }

  render () {
    return (
      <SetupTypeStep
        handleStepChange={this.onChangeStep}
        openSupportLink={this.openSupportLink}
        {...this.props}
      />
    )
  }
}

const mapDispatchToProps = dispatch => ({
  lockboxActions: bindActionCreators(actions.components.lockbox, dispatch)
})

export default connect(
  null,
  mapDispatchToProps
)(SetupTypeStepContainer)
