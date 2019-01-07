import React from 'react'
import PropTypes from 'prop-types'
import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { actions, selectors } from 'data'
import { merge } from 'ramda'
import { FormattedMessage } from 'react-intl'

import modalEnhancer from 'providers/ModalEnhancer'
import LockboxSetup from './template'
import DeviceSelectStep from './DeviceSelectStep'
import SetupTypeStep from './SetupTypeStep'
import ConnectDeviceStep from './ConnectDeviceStep'
import NameDeviceStep from './NameDeviceStep'
import AppManagerStep from './AppManagerStep'
import OpenBtcAppStep from './OpenBtcAppStep'
import ErrorStep from './ErrorStep'

class LockboxSetupContainer extends React.PureComponent {
  componentWillUnmount () {
    this.props.lockboxActions.resetConnectionStatus()
    this.props.lockboxActions.changeDeviceSetupStep('device-select')
  }
  onClose = () => {
    this.props.lockboxActions.lockboxModalClose()
    this.props.closeAll()
  }

  render () {
    const { currentStep, position, total, setupType } = this.props
    let steps = {
      'device-select': {
        num: 0,
        title: () => (
          <FormattedMessage
            id='modals.lockbox.setup.deviceselect.title'
            defaultMessage='Select Your Device Type'
          />
        ),
        template: () => <DeviceSelectStep />
      },
      'setup-type': {
        num: 1,
        title: () => (
          <FormattedMessage
            id='modals.lockbox.setup.setuptype.title'
            defaultMessage='Select Setup Type'
          />
        ),
        template: () => <SetupTypeStep />
      },
      'connect-device': {
        num: 2,
        title: () => (
          <FormattedMessage
            id='modals.lockbox.setup.connectdevice.title'
            defaultMessage='Connect Your Device'
          />
        ),
        template: () => <ConnectDeviceStep />
      },
      'customize-device': {
        num: 3,
        title: () => (
          <FormattedMessage
            id='modals.lockbox.setup.install.title'
            defaultMessage='Customize Your Device'
          />
        ),
        template: () => <AppManagerStep />
      },
      'open-btc-app': {
        num: 4,
        template: () => <OpenBtcAppStep done={currentStep.done} />
      },
      'name-device': { num: 5, template: () => <NameDeviceStep /> },
      'error-step': { num: 6, template: () => <ErrorStep /> }
    }
    if (setupType === 'existing') {
      steps = merge(steps, {
        'customize-device': { num: 3, template: () => <AppManagerStep /> },
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
        : steps['device-select']

    return (
      <LockboxSetup
        total={total}
        position={position}
        onClose={this.onClose}
        title={step.title}
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
