import React from 'react'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import {
  Link,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Text,
  TooltipHost,
  TooltipIcon
} from 'blockchain-info-components'
import CopyClipboard from 'components/Clipboard/CopyClipboard'
import QRCodeWrapper from 'components/QRCode/Wrapper'

const QRCodeContainer = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;
  width: 100%;
  padding: 30px 0;
`

const QRCode = props => {
  const { close, closeAll, position, total, ...rest } = props
  const { amount, message, receiveAddress } = rest.value
  let btcAddress = `bitcoin:${receiveAddress}`
  let amt = amount > 0 ? amount : null
  if (amt || message) btcAddress += '?'
  if (amt && !message) btcAddress += `amount=${amt}`
  if (!amt && message) btcAddress += `message=${message}`
  if (amt && message) btcAddress += `amount=${amt}&message=${message}`

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
            <TooltipIcon name='info' />
          </TooltipHost>
        </Text>
        <QRCodeContainer>
          <QRCodeWrapper value={btcAddress} size={256} />
        </QRCodeContainer>
        <CopyClipboard address={btcAddress} />
      </ModalBody>
      <ModalFooter>
        <Link onClick={close} size='13px' weight={500} data-e2e='qrModalGoBack'>
          <FormattedMessage id='buttons.go_back' defaultMessage='Go Back' />
        </Link>
      </ModalFooter>
    </Modal>
  )
}

QRCode.propTypes = {
  value: PropTypes.object.isRequired
}

export default QRCode
