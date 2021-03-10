import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { prop } from 'ramda'
import { bindActionCreators, compose } from 'redux'

import { actions, selectors } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'

import CheckVersionsStep from './CheckVersionsStep'
import CompleteStep from './CompleteStep'
import ConnectDeviceStep from './ConnectDeviceStep'
import InstallFirmwareStep from './InstallFirmwareStep'
import FirmwareContainer from './template'
import UninstallAppsStep from './UninstallAppsStep'

class LockboxFirmwareContainer extends React.PureComponent {
  componentDidMount() {
    this.props.lockboxActions.updateDeviceFirmware(this.props.deviceIndex)
  }

  componentWillUnmount() {
    this.props.lockboxActions.resetConnectionStatus()
    this.props.lockboxActions.changeFirmwareUpdateStep({
      step: 'connect-device'
    })
  }

  onClose = () => {
    this.props.lockboxActions.lockboxModalClose()
    this.props.closeAll()
  }

  render() {
    const { currentStep, deviceIndex, position, total } = this.props
    const steps = {
      'connect-device': 1,
      'check-versions': 2,
      'uninstall-apps': 3,
      'install-firmware': 4,
      'install-complete': 5
    }
    const step = currentStep ? steps[currentStep.step] : 1
    const status = prop('status', currentStep)

    return (
      <FirmwareContainer
        position={position}
        total={total}
        onClose={this.onClose}
        step={step}
        totalSteps={5}
      >
        {step === 1 && <ConnectDeviceStep deviceIndex={deviceIndex} />}
        {step === 2 && <CheckVersionsStep status={status} />}
        {step === 3 && <UninstallAppsStep status={status} />}
        {step === 4 && <InstallFirmwareStep status={status} />}
        {step === 5 && <CompleteStep status={status} onClose={this.onClose} />}
      </FirmwareContainer>
    )
  }
}

LockboxFirmwareContainer.propTypes = {
  deviceIndex: PropTypes.string.isRequired,
  position: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired
}

const mapStateToProps = state => ({
  currentStep: selectors.components.lockbox.getFirmwareUpdateStep(state)
})

const mapDispatchToProps = dispatch => ({
  lockboxActions: bindActionCreators(actions.components.lockbox, dispatch)
})

const enhance = compose(
  modalEnhancer('LockboxFirmware'),
  connect(mapStateToProps, mapDispatchToProps)
)

export default enhance(LockboxFirmwareContainer)
