import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Modal, ModalBody, ModalHeader } from 'blockchain-info-components'
import ModalStepper from 'components/ModalStepper'

const ContentWrapper = styled(ModalBody)`
  padding: 20px;
`

const LockboxFirmware = props => {
  const { children, onClose, position, total, step, totalSteps } = props
  return (
    <Modal size='small' position={position} total={total}>
      <ModalHeader onClose={onClose}>
        <FormattedMessage
          id='modals.lockbox.firmware.title'
          defaultMessage='Firmware Update'
        />
      </ModalHeader>
      <ModalStepper currentStep={step} totalSteps={totalSteps} />
      <ContentWrapper>{children}</ContentWrapper>
    </Modal>
  )
}

LockboxFirmware.propTypes = {
  position: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
  step: PropTypes.number.isRequired,
  totalSteps: PropTypes.number.isRequired
}

export default LockboxFirmware
