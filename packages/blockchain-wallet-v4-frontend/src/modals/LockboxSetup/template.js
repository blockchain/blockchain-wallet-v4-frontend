import React from 'react'
import PropTypes from 'prop-types'

import ModalStepper from 'components/ModalStepper'
import { Modal, ModalBody } from 'blockchain-info-components'

const LockboxSetup = props => {
  const { children, position, total, totalSteps, step } = props

  return (
    <Modal size='auto' position={position} total={total}>
      {step !== 0 &&
        step !== 5 && (
          <ModalStepper currentStep={step} totalSteps={totalSteps} />
        )}
      <ModalBody>{children}</ModalBody>
    </Modal>
  )
}

LockboxSetup.propTypes = {
  position: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  closeAll: PropTypes.func.isRequired
}

export default LockboxSetup
