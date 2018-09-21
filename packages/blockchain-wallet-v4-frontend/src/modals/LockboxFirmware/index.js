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
    const { currentStep, deviceIndex, position, total, closeAll } = this.props
    let step
    switch (currentStep) {
      case 'check-versions':
        step = 2
        break
      case 'verify-identifier':
        step = 3
        break
      case 'install-mcu':
        step = 4
        break
      case 'install-firmware':
        step = 5
        break
      case 'complete':
        step = 6
        break
      default:
        step = 1
        break
    }

    return (
      <FirmwareContainer
        position={position}
        total={total}
        closeAll={closeAll}
        step={step}
        totalSteps={5}
      >
        {step === 1 && <ConnectDeviceStep deviceIndex={deviceIndex} />}
        {step === 2 && <CheckVersionsStep />}
        {step === 3 && <ConfirmIdentifierStep />}
        {step === 4 && <InstallMcuStep />}
        {step === 5 && <InstallFirmwareStep />}
        {step === 6 && <CompleteStep closeAll={closeAll} />}
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
