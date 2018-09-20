import React from 'react'
import PropTypes from 'prop-types'
import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { actions, selectors } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'
import FirmwareContainer from './template'
import ConnectDeviceStep from './ConnectDeviceStep'
import CompleteStep from './CompleteStep'
import CheckVersionsStep from './CheckVersionsStep'

class LockboxFirmwareContainer extends React.PureComponent {
  componentWillMount () {
    this.props.lockboxActions.updateDeviceFirmware(this.props.deviceIndex)
  }

  render () {
    const { currentStep, deviceIndex, position, total, closeAll } = this.props
    let step
    switch (currentStep) {
      case 'check-versions':
        step = 1
        break
      case 'verify-identifier':
        step = 2
        break
      case 'install':
        step = 3
        break
      case 'complete':
        step = 4
        break
      default:
        step = 0
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
        {step === 0 && <ConnectDeviceStep deviceIndex={deviceIndex} />}
        {step === 1 && <CheckVersionsStep />}
        {step === 2 && <div>Step 3</div>}
        {step === 3 && <div>Step 4</div>}
        {step === 4 && <CompleteStep closeAll={closeAll} />}
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
