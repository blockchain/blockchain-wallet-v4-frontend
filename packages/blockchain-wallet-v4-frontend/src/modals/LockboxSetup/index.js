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
    const { step, done } = currentStep || {}

    return (
      <LockboxSetup
        total={total}
        position={position}
        closeAll={closeAll}
        handleClose={this.handleClose}
      >
        {(!step || step === 'setup-type') && <SetupTypeStep />}
        {step === 'connect-device' && <ConnectDeviceStep />}
        {step === 'auth-check' && <AuthenticityStep />}
        {step === 'open-btc-app' && <OpenBtcAppStep done={done} />}
        {step === 'name-device' && <NameDeviceStep />}
        {step === 'error-step' && <ErrorStep />}
      </LockboxSetup>
    )
  }
}

LockboxSetupContainer.propTypes = {
  currentStep: PropTypes.string.isRequired,
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
