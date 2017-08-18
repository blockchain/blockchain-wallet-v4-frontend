import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import QRCodeReact from 'qrcode-react'

import { Link, Modal } from 'blockchain-info-components'
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

const QRCode = (props) => {
  const { address, handleBack, ...rest } = props
  const bitcoinAddress = `bitcoin:${address}`

  return (
    <Modal {...rest} icon='icon-receive' title='Payment address' size='large'>
      <FormattedMessage id='modals.qrcode.scan' defaultMessage='Scan QR Code' />
      <QRCodeContainer>
        <QRCodeReact value={bitcoinAddress} size={256} />
      </QRCodeContainer>
      <CopyClipboard address={bitcoinAddress} />
      <Footer>
        <Link onClick={handleBack}>
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
