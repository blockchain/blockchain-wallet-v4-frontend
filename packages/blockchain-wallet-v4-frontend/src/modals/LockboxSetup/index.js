import React from 'react'
import PropTypes from 'prop-types'
import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { actions, selectors } from 'data'

import modalEnhancer from 'providers/ModalEnhancer'
import LockboxSetup from './template'
import OptionsStep from './OptionsStep'
import ConnectStep from './ConnectStep'

class LockboxSetupContainer extends React.PureComponent {
  render () {
    const { step, position, total, closeAll, ...rest } = this.props
    const { lockboxActions } = rest
    return (
      <LockboxSetup position={position} total={total} closeAll={closeAll}>
        {step === 'options' && (
          <OptionsStep handleStep={lockboxActions.setConnectStep} />
        )}
        {step === 'connect' && <ConnectStep />}
      </LockboxSetup>
    )
  }
}

LockboxSetupContainer.propTypes = {
  step: PropTypes.number.isRequired,
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
