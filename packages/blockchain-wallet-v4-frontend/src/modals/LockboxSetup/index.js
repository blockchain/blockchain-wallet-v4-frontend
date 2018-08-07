import React from 'react'
import PropTypes from 'prop-types'
import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { actions, selectors } from 'data'

import modalEnhancer from 'providers/ModalEnhancer'
import LockboxSetup from './template'
import SetupTypeStep from './SetupTypeStep'
import ConnectDeviceStep from './ConnectDeviceStep'
import NameDeviceStep from './NameDeviceStep'
import ConfirmRecoveryStep from './ConfirmRecoveryStep'
import SaveAccountsStep from './SaveAccountsStep'

class LockboxSetupContainer extends React.PureComponent {
  render () {
    const { step, position, total, closeAll, ...rest } = this.props
    const { lockboxActions } = rest
    return (
      <LockboxSetup position={position} total={total} closeAll={closeAll}>
        {step === 'setup-type' && (
          <SetupTypeStep handleStep={lockboxActions.setConnectStep} />
        )}
        {step === 'connect' && <ConnectDeviceStep />}
        {step === 'name-device' && <NameDeviceStep />}
        {step === 'confirm-recovery' && <ConfirmRecoveryStep />}
        {step === 'save-accounts' && <SaveAccountsStep />}
      </LockboxSetup>
    )
  }
}

LockboxSetupContainer.propTypes = {
  step: PropTypes.string.isRequired,
  position: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  closeAll: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  step: selectors.components.lockbox.getStep(state)
})

const mapDispatchToProps = dispatch => ({
  lockboxActions: bindActionCreators(actions.components.lockbox, dispatch)
})

const enhance = compose(
  modalEnhancer('LockboxSetup'),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)

export default enhance(LockboxSetupContainer)
