import React from 'react'
import PropTypes from 'prop-types'
import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { actions, selectors } from 'data'
import { FormattedMessage } from 'react-intl'

import modalEnhancer from 'providers/ModalEnhancer'
import AppManagerStep from './AppManagerStep'
import ConnectDeviceStep from './ConnectDeviceStep'
import CustomizeStep from './CustomizeStep'
import DeviceSelectStep from './DeviceSelectStep'
import ErrorStep from './ErrorStep'
import FinishSetupStep from './FinishSetupStep'
import LockboxSetup from './template'
import PairDeviceStep from './PairDeviceStep'
import SetupTypeStep from './SetupTypeStep'

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
        title: () => (
          <FormattedMessage
            id='modals.lockbox.setup.deviceselect.title'
            defaultMessage='Select Your Device'
          />
        ),
        template: () => <DeviceSelectStep />
      },
      'setup-type': {
        title: () => (
          <FormattedMessage
            id='modals.lockbox.setup.setuptype.title'
            defaultMessage='Select Setup Type'
          />
        ),
        template: () => <SetupTypeStep />
      },
      'connect-device': {
        title: () => (
          <FormattedMessage
            id='modals.lockbox.setup.connect.title'
            defaultMessage='Connect Your Device'
          />
        ),
        template: () => <ConnectDeviceStep />
      },
      'customize-device': {
        title: () => (
          <FormattedMessage
            id='modals.lockbox.setup.customize.title'
            defaultMessage='Customize Your Device'
          />
        ),
        template: () => <CustomizeStep />
      },
      'app-manager-step': {
        title: () => (
          <FormattedMessage
            id='modals.lockbox.setup.appmanager.title'
            defaultMessage='App Manager'
          />
        ),
        template: () => <AppManagerStep />
      },
      'pair-device': {
        title: () => (
          <FormattedMessage
            id='modals.lockbox.setup.connectdevice.title'
            defaultMessage='Pair Device'
          />
        ),
        template: () => <PairDeviceStep done={currentStep.done} />
      },
      'finish-step': {
        title: () => (
          <FormattedMessage
            id='modals.lockbox.setup.finish.title'
            defaultMessage='Setup Complete'
          />
        ),
        template: () => <FinishSetupStep onClose={this.onClose} />
      },
      'error-step': {
        title: () => (
          <FormattedMessage
            id='modals.lockbox.setup.error.title'
            defaultMessage='Error'
          />
        ),
        template: () => <ErrorStep onClose={this.onClose} />
      }
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
