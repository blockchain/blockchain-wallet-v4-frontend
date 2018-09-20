import React from 'react'
import PropTypes from 'prop-types'
import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { actions, selectors } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'
import LockboxFirmware from './template'
// import CheckForUpdatesStep from './CheckForUpdatesStep'
// import UpgradeFirmwareStep from './UpgradeFirmwareStep'

class LockboxFirmwareContainer extends React.PureComponent {
  componentWillUnmount () {
    this.props.lockboxActions.changeFirmwareUpdateStep('connect-device')
  }

  render () {
    const { step, deviceIndex, position, total, closeAll } = this.props

    return (
      <LockboxFirmware position={position} total={total} closeAll={closeAll} step={step}>
        {(!step || step === 'connect-device') && <div />}
        {step === 'check-for-updates' && <div />}
        {step === 'verify-identifier' && <div />}
        {step === 'install-mcu' && <div />}
        {step === 'install-firmware' && <div />}
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
