import React from 'react'
import { FormattedHTMLMessage } from 'react-intl'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Modal, ModalBody, ModalHeader } from 'blockchain-info-components'
import Announcements from 'components/Announcements'

const SendHeader = styled(ModalHeader)`
  border-bottom: 0;
  padding-bottom: 8px;
  > div:first-child * {
    color: ${props => props.theme.blue900};
  }
`

const SendEth = props => (
  <Modal size='medium' position={props.position} total={props.total}>
    <SendHeader icon='send' onClose={props.closeAll}>
      <FormattedHTMLMessage
        id='modals.sendeth.cointitle'
        defaultMessage='Send {coinDisplayName}'
        values={{ coinDisplayName: props.coinDisplayName }}
      />
    </SendHeader>
    <Announcements type='service' alertArea='send' currentCoin={props.coin} />
    <ModalBody>{props.children}</ModalBody>
  </Modal>
)

SendEth.propTypes = {
  coin: PropTypes.string.isRequired,
  coinDisplayName: PropTypes.string.isRequired,
  position: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  closeAll: PropTypes.func.isRequired
}

export default SendEth
