import React from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'

import modalEnhancer from 'providers/ModalEnhancer'
import LockboxSetup from './template'
import FirstStep from './FirstStep'

class LockboxSetupContainer extends React.PureComponent {
  render () {
    const { step, position, total, closeAll } = this.props
    return (
      <LockboxSetup position={position} total={total} closeAll={closeAll}>
        {step === 1 && <FirstStep />}
        {/* {step === 2 && <SecondStep />} */}
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
  step: 1
})

const enhance = compose(
  modalEnhancer('LockboxSetup'),
  connect(mapStateToProps)
)

export default enhance(LockboxSetupContainer)
