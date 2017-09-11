import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import QRCodeReact from 'qrcode-react'

import { Link, Modal, ModalHeader, ModalBody, ModalFooter, Text, TextGroup, Tooltip } from 'blockchain-info-components'
import CopyClipboard from './CopyClipboard'

const QRCodeContainer = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;
  width: 100;
  padding: 30px 0;
`

const QRCode = (props) => {
  const { address, handleBack, close } = props
  const bitcoinAddress = `bitcoin:${address}`

  return (
    <Modal size='large'>
      <ModalHeader icon='request' onClose={close}>
        <FormattedMessage id='modals.qrcode.title' defaultMessage='Payment address' />
      </ModalHeader>
      <ModalBody>
        <TextGroup>
          <Text size='14px' weight={500} capitalize>
            <FormattedMessage id='modals.qrcode.scan' defaultMessage='Scan QR Code' />
          </Text>
          <Tooltip>
            <FormattedMessage id='modals.qrcode.tooltip' defaultMessage='Ask the sender to scan this QR code with their bitcoin wallet.' />
          </Tooltip>
        </TextGroup>
        <QRCodeContainer>
          <QRCodeReact value={bitcoinAddress} size={256} />
        </QRCodeContainer>
        <CopyClipboard address={bitcoinAddress} />
      </ModalBody>
      <ModalFooter>
        <Link onClick={handleBack} size='13px' weight={300}>
          <FormattedMessage id='modals.qrcode.back' defaultMessage='Go back' />
        </Link>
      </ModalFooter>
    </Modal>
  )
}

QRCode.propTypes = {
  address: PropTypes.string.isRequired,
  handleBack: PropTypes.func
}

export default QRCode
