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

const SendEth = (props) => (
  <Modal size='large' position={props.position} total={props.total}>
    <SendHeader icon='send' onClose={props.closeAll}>
      <FormattedMessage
        id='modals.sendeth.cointitle'
        defaultMessage='Send {coinDisplayName}'
        values={{ coinDisplayName: props.coinDisplayName }}
      />
    </SendHeader>
    <ServiceAnnouncement alertArea='send' currentCoin={props.coin} />
    <ModalBody>{props.children}</ModalBody>
  </Modal>
)

SendEth.propTypes = {
  closeAll: PropTypes.func.isRequired,
  coin: PropTypes.string.isRequired,
  coinDisplayName: PropTypes.string.isRequired,
  position: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired
}

export default SendEth
