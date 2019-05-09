import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Modal, ModalHeader, ModalBody } from 'blockchain-info-components'

const SendHeader = styled(ModalHeader)`
  border-bottom: 0px;
  padding-bottom: 8px;
  > div:first-child * {
    color: ${props => props.theme['brand-primary']};
  }
`

const SendBch = props => (
  <Modal size='medium' position={props.position} total={props.total}>
    <SendHeader icon='send' onClose={props.closeAll}>
      <FormattedMessage
        id='modals.sendbch.title'
        defaultMessage='Send Bitcoin Cash'
      />
    </SendHeader>
    <ModalBody>{props.children}</ModalBody>
  </Modal>
)

SendBch.propTypes = {
  position: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  closeAll: PropTypes.func.isRequired
}

export default SendBch
