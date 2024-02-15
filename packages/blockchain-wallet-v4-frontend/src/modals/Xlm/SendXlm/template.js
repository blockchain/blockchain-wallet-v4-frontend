import React from 'react'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Modal, ModalBody, ModalHeader } from 'blockchain-info-components'
import { ServiceAnnouncement } from 'components/Announcements'

const SendHeader = styled(ModalHeader)`
  border-bottom: 0;
  padding-bottom: 8px;
  > div:first-child * {
    color: ${(props) => props.theme.blue900};
  }
`

const SendXlm = (props) => (
  <Modal size='large' position={props.position} total={props.total}>
    <SendHeader icon='send' onClose={props.closeAll}>
      <FormattedMessage id='modals.sendxlm.title' defaultMessage='Send Stellar' />
    </SendHeader>
    <ServiceAnnouncement alertArea='send' currentCoin='XLM' />
    <ModalBody>{props.children}</ModalBody>
  </Modal>
)

SendXlm.propTypes = {
  closeAll: PropTypes.func.isRequired,
  position: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired
}

export default SendXlm
