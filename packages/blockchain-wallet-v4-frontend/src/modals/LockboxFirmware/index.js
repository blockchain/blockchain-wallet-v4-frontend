import React from 'react'
import PropTypes from 'prop-types'
import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { actions, selectors } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'
import FirmwareContainer from './template'
import ConnectDeviceStep from './ConnectDeviceStep'
import ConfirmIdentifierStep from './ConfirmIdentifierStep'
import CompleteStep from './CompleteStep'
import CheckVersionsStep from './CheckVersionsStep'
import InstallMcuStep from './InstallMcuStep'
import InstallFirmwareStep from './InstallFirmwareStep'

class LockboxFirmwareContainer extends React.PureComponent {
  componentWillMount () {
    this.props.lockboxActions.updateDeviceFirmware(this.props.deviceIndex)
  }

  render () {
    const { closeAll, currentStep, deviceIndex, position, total } = this.props
    const steps = {
      'connect-device': 1,
      'check-versions': 2,
      'install-mcu': 3,
      'install-osu-firmware': 3,
      'install-final-firmware': 4,
      complete: 5
    }
    const step = currentStep ? steps[currentStep.step] : 1

    return (
      <FirmwareContainer
        position={position}
        total={total}
        closeAll={closeAll}
        step={step}
        totalSteps={4}
      >
        {step === 1 && <ConnectDeviceStep deviceIndex={deviceIndex} />}
        {step === 2 && <CheckVersionsStep status={currentStep.status} />}
        {/* {step === 3 && <ConfirmIdentifierStep />} */}
        {step === 3 && <InstallMcuStep status={currentStep.status} />}
        {step === 4 && <InstallFirmwareStep status={currentStep.status} />}
        {step === 5 && <CompleteStep closeAll={closeAll} />}
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
