import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Modal, ModalBody } from 'blockchain-info-components'
import ModalStepper from 'components/ModalStepper'

const ContentWrapper = styled(ModalBody)`
  padding: 20px;
  height: 300px;
`
const LockboxFirmware = props => {
  const { children, position, total, step, totalSteps } = props
  return (
    <Modal size='large' position={position} total={total}>
      <ModalStepper currentStep={step} totalSteps={totalSteps} />
      <ContentWrapper>{children}</ContentWrapper>
    </Modal>
  )
}

LockboxFirmware.propTypes = {
  position: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  closeAll: PropTypes.func.isRequired
}

export default LockboxFirmware
