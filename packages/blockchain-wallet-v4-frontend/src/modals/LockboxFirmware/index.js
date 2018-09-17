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
  render () {
    const { currentStep, deviceIndex, position, total, closeAll } = this.props

    return (
      <LockboxFirmware position={position} total={total} closeAll={closeAll}>
        {(!currentStep || currentStep === 'check-for-updates-step') && (
          <CheckForUpdatesStep deviceIndex={deviceIndex} />
        )}
        {currentStep === 'upgrade-firmware-step' && <UpgradeFirmwareStep />}
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
