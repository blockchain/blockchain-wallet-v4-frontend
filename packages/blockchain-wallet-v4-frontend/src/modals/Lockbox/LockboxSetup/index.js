import React from 'react'
import PropTypes from 'prop-types'
import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { actions, selectors } from 'data'
import { merge } from 'ramda'

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
    const { currentStep, position, total, closeAll, setupType } = this.props
    let steps = {
      'setup-type': { num: 0, template: () => <SetupTypeStep /> },
      'connect-device': { num: 1, template: () => <ConnectDeviceStep /> },
      'auth-check': { num: 2, template: () => <AuthenticityStep /> },
      'install-btc-app': { num: 3, template: () => <InstallBtcAppStep /> },
      'open-btc-app': {
        num: 4,
        template: () => <OpenBtcAppStep done={currentStep.done} />
      },
      'name-device': { num: 5, template: () => <NameDeviceStep /> },
      'error-step': { num: 6, template: () => <ErrorStep /> }
    }
    if (setupType === 'existing') {
      steps = merge(steps, {
        'install-btc-app': { num: 3, template: () => <InstallBtcAppStep /> },
        'open-btc-app': {
          num: 3,
          template: () => <OpenBtcAppStep done={currentStep.done} />
        },
        'name-device': { num: 4, template: () => <NameDeviceStep /> }
      })
    }

    const step =
      currentStep && currentStep.step
        ? steps[currentStep.step]
        : steps['setup-type']
    // console.info(setupType, steps, currentStep, step)

    return (
      <LockboxSetup
        total={total}
        position={position}
        closeAll={closeAll}
        handleClose={this.handleClose}
        totalSteps={setupType === 'existing' ? 4 : 5}
        step={step.num}
      >
        {step.template()}
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
  currentStep: selectors.components.lockbox.getNewDeviceSetupStep(state),
  setupType: selectors.components.lockbox.getNewDeviceSetupType(state)
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
