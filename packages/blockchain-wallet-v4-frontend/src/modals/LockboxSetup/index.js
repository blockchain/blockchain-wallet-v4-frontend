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
import OpenBtcAppStep from './OpenBtcAppStep'
import ErrorStep from './ErrorStep'

class LockboxSetupContainer extends React.PureComponent {
  componentWillUnmount () {
    this.props.lockboxActions.changeDeviceSetupStep('setup-type')
  }

  render () {
    const { currentStep, position, total, closeAll } = this.props
    let { step, done } = currentStep || {}
    switch (step) {
      case 'connect-device':
        step = 1
        break
      case 'auth-check':
        step = 2
        break
      case 'open-btc-app':
        step = 3
        break
      case 'name-device':
        step = 4
        break
      case 'error-step':
        step = 5
        break
      default:
        step = 0
        break
    }

    return (
      <LockboxSetup
        total={total}
        position={position}
        closeAll={closeAll}
        handleClose={this.handleClose}
        step={step}
        totalSteps={4}
      >
        {step === 0 && <SetupTypeStep />}
        {step === 1 && <ConnectDeviceStep />}
        {step === 2 && <AuthenticityStep />}
        {step === 3 && <OpenBtcAppStep done={done} />}
        {step === 4 && <NameDeviceStep />}
        {step === 5 && <ErrorStep />}
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
