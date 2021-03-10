import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { bindActionCreators, compose } from 'redux'

import { actions, selectors } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'

import AppManagerStep from './AppManagerStep'
import ConnectDeviceStep from './ConnectDeviceStep'
import CustomizeStep from './CustomizeStep'
import DeviceSelectStep from './DeviceSelectStep'
import ErrorStep from './ErrorStep'
import FinishSetupStep from './FinishSetupStep'
import { RESTORE_DEVICE_LINK, SUPPORT_LINK } from './model'
import PairDeviceStep from './PairDeviceStep'
import SetupTypeStep from './SetupTypeStep'
import SoftwareDownloadStep from './SoftwareDownloadStep'
import LockboxSetup from './template'

class LockboxSetupContainer extends React.PureComponent {
  UNSAFE_componentWillMount() {
    this.props.lockboxActions.resetNewDeviceSetup()
  }

  componentWillUnmount() {
    this.props.lockboxActions.resetConnectionStatus()
    this.props.lockboxActions.changeDeviceSetupStep('device-select')
  }
  onClose = () => {
    const { closeAll, currentStep, lockboxActions } = this.props
    // if lockbox setup complete but the user clicks the modal close X
    if (currentStep && currentStep.step === 'finish-step') {
      this.props.lockboxActions.routeNewDeviceToDashboard(false)
    }
    lockboxActions.lockboxModalClose()
    closeAll()
  }

  render() {
    const { currentStep, position, total } = this.props
    const steps = {
      'device-select': {
        title: () => (
          <FormattedMessage
            id='modals.lockbox.setup.deviceselect.title'
            defaultMessage='Select Your Device'
          />
        ),
        template: () => (
          <DeviceSelectStep restoreDeviceLink={RESTORE_DEVICE_LINK} />
        )
      },
      'setup-type': {
        title: () => (
          <FormattedMessage
            id='modals.lockbox.setup.setuptype.title'
            defaultMessage="Let's Get Started"
          />
        ),
        template: () => <SetupTypeStep />
      },
      'software-download': {
        title: () => (
          <FormattedMessage
            id='modals.lockbox.setup.softwaredownload.title'
            defaultMessage='Software Download'
          />
        ),
        template: () => <SoftwareDownloadStep />
      },
      'connect-device': {
        title: () => (
          <FormattedMessage
            id='modals.lockbox.setup.connect.title'
            defaultMessage='Connect Your Device'
          />
        ),
        template: () => <ConnectDeviceStep supportLink={SUPPORT_LINK} />
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
        template: () => <PairDeviceStep supportLink={SUPPORT_LINK} />
      },
      'finish-step': {
        title: () => (
          <FormattedMessage
            id='modals.lockbox.setup.finish.title'
            defaultMessage='Setup Complete'
          />
        ),
        template: () => <FinishSetupStep onClose={this.props.closeAll} />
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
  connect(mapStateToProps, mapDispatchToProps)
)

export default enhance(LockboxSetupContainer)
