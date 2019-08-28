import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import Announcements from 'components/Announcements'
import { Modal, ModalHeader, ModalBody } from 'blockchain-info-components'

const SendHeader = styled(ModalHeader)`
  border-bottom: 0;
  padding-bottom: 8px;
  > div:first-child * {
    color: ${props => props.theme['brand-primary']};
  }
`

const SendXlm = props => (
  <Modal size='medium' position={props.position} total={props.total}>
    <SendHeader icon='send' onClose={props.closeAll}>
      <FormattedMessage
        id='modals.sendxlm.title'
        defaultMessage='Send Stellar'
      />
    </SendHeader>
    <Announcements type='service' alertArea='send' currentCoin='XLM' />
    <ModalBody>{props.children}</ModalBody>
  </Modal>
)

SendXlm.propTypes = {
  position: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  closeAll: PropTypes.func.isRequired
}

export default SendXlm
