import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Modal, ModalHeader, ModalBody } from 'blockchain-info-components'

const SendHeader = styled(ModalHeader)`
  border-bottom: 0px;
  padding-bottom: 8px;
  > div:first-child * {
    color: ${props => props.theme['brand-primary']};
  }
`

const SendBtc = props => (
  <Modal size='medium' position={props.position} total={props.total}>
    <SendHeader icon='send' onClose={props.closeAll}>
      <FormattedMessage
        id='modals.sendbitcoin.title'
        defaultMessage='Send Bitcoin'
      />
    </SendHeader>
    <ModalBody>{props.children}</ModalBody>
  </Modal>
)

SendBtc.propTypes = {
  position: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  closeAll: PropTypes.func.isRequired
}

export default SendBtc
