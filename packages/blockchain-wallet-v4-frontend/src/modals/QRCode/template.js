import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import QRCodeWrapper from 'components/QRCodeWrapper'

import {
  Link,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Text,
  TooltipHost,
  TooltipIcon
} from 'blockchain-info-components'
import CopyClipboard from 'components/CopyClipboard'

const QRCodeContainer = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;
  width: 100%;
  padding: 30px 0;
`

const QRCode = props => {
  const { position, total, close, closeAll, ...rest } = props
  const { receiveAddress, amount, message } = rest.value
  let bitcoinAddress = `bitcoin:${receiveAddress}`
  let amt = amount > 0 ? amount : null
  if (amt || message) bitcoinAddress += '?'
  if (amt && !message) bitcoinAddress += `amount=${amt}`
  if (!amt && message) bitcoinAddress += `message=${message}`
  if (amt && message) bitcoinAddress += `amount=${amt}&message=${message}`

  return (
    <Modal size='large' position={position} total={total}>
      <ModalHeader icon='request' onClose={closeAll}>
        <FormattedMessage id='modals.qrcode.title' defaultMessage='Request' />
      </ModalHeader>
      <ModalBody>
        <Text size='14px' weight={500}>
          <FormattedMessage
            id='modals.qrcode.scan'
            defaultMessage='Scan QR Code'
          />
          <TooltipHost id='qrcode.tooltip'>
            <TooltipIcon name='question-in-circle' />
          </TooltipHost>
        </Text>
        <QRCodeContainer>
          <QRCodeWrapper value={bitcoinAddress} size={256} />
        </QRCodeContainer>
        <CopyClipboard address={bitcoinAddress} />
      </ModalBody>
      <ModalFooter>
        <Link onClick={close} size='13px' weight={300} data-e2e='qrModalGoBack'>
          <FormattedMessage id='modals.qrcode.back' defaultMessage='Go back' />
        </Link>
      </ModalFooter>
    </Modal>
  )
}

QRCode.propTypes = {
  value: PropTypes.object.isRequired
}

export default QRCode
