import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'

import ModalStepper from 'components/ModalStepper'
import { Modal, ModalBody, ModalHeader } from 'blockchain-info-components'

const LockboxSetup = props => {
  const { children, position, total, totalSteps, step, onClose } = props
  const atBounds = step === 0 || step > totalSteps

  return (
    <Modal size={atBounds ? 'auto' : 'small'} position={position} total={total}>
      <ModalHeader onClose={onClose}>
        <FormattedMessage
          id='modals.lockbox.setup.title'
          defaultMessage='Lockbox Setup'
        />
      </ModalHeader>
      {!atBounds && <ModalStepper currentStep={step} totalSteps={totalSteps} />}
      <ModalBody>{children}</ModalBody>
    </Modal>
  )
}

LockboxSetup.propTypes = {
  position: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired
}

export default LockboxSetup
