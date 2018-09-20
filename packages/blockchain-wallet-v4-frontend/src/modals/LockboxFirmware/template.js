import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Modal, ModalBody } from 'blockchain-info-components'

const StepHeader = styled.div`
  background-color: ${props => props.theme['brand-secondary']};
  border-radius: 4px 4px 0 0;
  height: 75px;
`
const ContentWrapper = styled(ModalBody)`
  padding: 20px;
  height: 300px;
`

const LockboxFirmware = props => (
  <Modal size='large' position={props.position} total={props.total}>
    <StepHeader>
      Step 1
    </StepHeader>
    <ContentWrapper>
      <div>Content</div>
      {props.children}
    </ContentWrapper>
  </Modal>
)

LockboxFirmware.propTypes = {
  position: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  closeAll: PropTypes.func.isRequired
}

export default LockboxFirmware
