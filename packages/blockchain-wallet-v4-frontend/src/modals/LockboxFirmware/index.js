import React from 'react'
import PropTypes from 'prop-types'
import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { actions, selectors } from 'data'

import modalEnhancer from 'providers/ModalEnhancer'
import LockboxFirmware from './template'
import OpenDashboardStep from './OpenDashboardStep'

class LockboxFirmwareContainer extends React.PureComponent {
  render () {
    const { currentStep, deviceId, position, total, closeAll } = this.props

    return (
      <LockboxFirmware position={position} total={total} closeAll={closeAll}>
        {!currentStep && <OpenDashboardStep deviceId={deviceId} />}
        {currentStep === 'compare-versions-step' && (
          <div>Comparing versions</div>
        )}
        {currentStep === 'device-up-to-date' && (
          <div>Device is up to date!</div>
        )}
        {currentStep === 'start-update-step' && <div>Update found</div>}
        {currentStep === 'firmware-updated-step' && <div>Update Complete</div>}
      </LockboxFirmware>
    )
  }
}

LockboxFirmwareContainer.propTypes = {
  currentStep: PropTypes.string.isRequired,
  deviceId: PropTypes.string.isRequired,
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
