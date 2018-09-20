import React from 'react'
import PropTypes from 'prop-types'
import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { actions, selectors } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'
import LockboxFirmware from './template'
import CheckForUpdatesStep from './CheckForUpdatesStep'
import UpgradeFirmwareStep from './UpgradeFirmwareStep'

class LockboxFirmwareContainer extends React.PureComponent {
  componentWillUnmount () {
    this.props.lockboxActions.changeFirmwareUpdateStep('connect-device')
  }

  render () {
    const { currentStep, deviceIndex, position, total, closeAll } = this.props
    let step
    switch (currentStep) {
      case 'check-for-updates':
        step = 1
        break
      case 'verify-identifier':
        step = 2
        break
      case 'install-mcu':
        step = 3
        break
      case 'install-firmware':
        step = 4
        break
      default:
        step = 0
        break
    }

    return (
      <LockboxFirmware
        position={position}
        total={total}
        closeAll={closeAll}
        step={step}
        totalSteps={5}
      >
        {step === 0 && <CheckForUpdatesStep deviceIndex={deviceIndex} />}
        {step === 1 && <UpgradeFirmwareStep />}
        {step === 2 && <div>Step 3</div>}
        {step === 3 && <div>Step 4</div>}
        {step === 4 && <div>Step 5</div>}
      </LockboxFirmware>
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
