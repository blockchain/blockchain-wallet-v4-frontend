import React from 'react'
import PropTypes from 'prop-types'
import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { prop } from 'ramda'

import { actions, selectors } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'
import FirmwareContainer from './template'
import ConnectDeviceStep from './ConnectDeviceStep'
import UninstallAppsStep from './UninstallAppsStep'
import CompleteStep from './CompleteStep'
import CheckVersionsStep from './CheckVersionsStep'
import InstallFirmwareStep from './InstallFirmwareStep'

class LockboxFirmwareContainer extends React.PureComponent {
  componentDidMount () {
    this.props.lockboxActions.updateDeviceFirmware(this.props.deviceIndex)
  }

  componentWillUnmount () {
    this.props.lockboxActions.resetConnectionStatus()
    this.props.lockboxActions.changeFirmwareUpdateStep({
      step: 'connect-device'
    })
  }

  render () {
    const { closeAll, currentStep, deviceIndex, position, total } = this.props
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
        closeAll={closeAll}
        step={step}
        totalSteps={5}
      >
        {step === 1 && <ConnectDeviceStep deviceIndex={deviceIndex} />}
        {step === 2 && <CheckVersionsStep status={status} />}
        {step === 3 && <UninstallAppsStep status={status} />}
        {step === 4 && <InstallFirmwareStep status={status} />}
        {step === 5 && <CompleteStep status={status} closeAll={closeAll} />}
      </FirmwareContainer>
    )
  }
}

LockboxFirmwareContainer.propTypes = {
  deviceIndex: PropTypes.string.isRequired,
  position: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  closeAll: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  currentStep: selectors.components.lockbox.getFirmwareUpdateStep(state)
})

const mapDispatchToProps = dispatch => ({
  lockboxActions: bindActionCreators(actions.components.lockbox, dispatch)
})

const enhance = compose(
  modalEnhancer('LockboxFirmware'),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)

export default enhance(LockboxFirmwareContainer)
