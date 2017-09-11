import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import QRCodeReact from 'qrcode-react'

import { Link, Modal, Text, Tooltip } from 'blockchain-info-components'
import CopyClipboard from './CopyClipboard'
import modalEnhancer from 'providers/ModalEnhancer'

const QRCodeContainer = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;
  width: 100;
  padding: 30px 0;
`
const Footer = styled.div`
  padding: 5px 0;
`
const Aligned = styled.div`
& > * { display: inline-block; margin-right: 5px; }
`

const QRCode = (props) => {
  const { address, handleBack, ...rest } = props
  const bitcoinAddress = `bitcoin:${address}`

  return (
    <Modal {...rest} icon='request' title='Payment address' size='large'>
      <Aligned>
        <Text size='14px' weight={500} capitalize>
          <FormattedMessage id='modals.qrcode.scan' defaultMessage='Scan QR Code' />
        </Text>
        <Tooltip>
          <FormattedMessage id='modals.qrcode.tooltip' defaultMessage='Ask the sender to scan this QR code with their bitcoin wallet.' />
        </Tooltip>
      </Aligned>
      <QRCodeContainer>
        <QRCodeReact value={bitcoinAddress} size={256} />
      </QRCodeContainer>
      <CopyClipboard address={bitcoinAddress} />
      <Footer>
        <Link onClick={handleBack} size='13px' weight={300}>
          <FormattedMessage id='modals.qrcode.back' defaultMessage='Go back' />
        </Link>
      </Footer>
    </Modal>
  )
}

QRCode.propTypes = {
  address: PropTypes.string.isRequired,
  handleBack: PropTypes.func
}

const enhance = modalEnhancer('QRCode')

export default enhance(QRCode)
