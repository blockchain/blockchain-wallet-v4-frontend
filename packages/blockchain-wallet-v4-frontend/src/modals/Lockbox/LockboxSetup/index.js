import React from 'react'
import PropTypes from 'prop-types'
import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { actions, selectors } from 'data'

import modalEnhancer from 'providers/ModalEnhancer'
import LockboxSetup from './template'
import SetupTypeStep from './SetupTypeStep'
import ConnectDeviceStep from './ConnectDeviceStep'
import AuthenticityStep from './AuthenticityStep'
import NameDeviceStep from './NameDeviceStep'
import InstallBtcAppStep from './InstallBtcAppStep'
import OpenBtcAppStep from './OpenBtcAppStep'
import ErrorStep from './ErrorStep'

class LockboxSetupContainer extends React.PureComponent {
  componentWillUnmount () {
    this.props.lockboxActions.resetConnectionStatus()
    this.props.lockboxActions.changeDeviceSetupStep('setup-type')
  }

  render () {
    const { currentStep, position, total, closeAll } = this.props
    const steps = {
      'setup-type': 0,
      'connect-device': 1,
      'auth-check': 2,
      'install-btc-app': 3,
      'open-btc-app': 4,
      'name-device': 5,
      'error-step': 6
    }
    const step = currentStep && currentStep.step ? steps[currentStep.step] : 0

    return (
      <LockboxSetup
        total={total}
        position={position}
        closeAll={closeAll}
        handleClose={this.handleClose}
        totalSteps={5}
        step={step}
      >
        {step === 0 && <SetupTypeStep />}
        {step === 1 && <ConnectDeviceStep />}
        {step === 2 && <AuthenticityStep />}
        {step === 3 && <InstallBtcAppStep />}
        {step === 4 && <OpenBtcAppStep done={currentStep.done} />}
        {step === 5 && <NameDeviceStep />}
        {step === 6 && <ErrorStep />}
      </LockboxSetup>
    )
  }
}

LockboxSetupContainer.propTypes = {
  position: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  closeAll: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  currentStep: selectors.components.lockbox.getNewDeviceSetupStep(state)
})

const mapDispatchToProps = dispatch => ({
  lockboxActions: bindActionCreators(actions.components.lockbox, dispatch)
})

const enhance = compose(
  modalEnhancer('LockboxSetup'),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)

export default enhance(LockboxSetupContainer)
