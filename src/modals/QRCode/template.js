import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import QRCodeReact from 'qrcode-react'

import { Link } from 'components/generic/Link'
import { Text } from 'components/generic/Text'
import Modal from 'components/generic/Modal'
import CopyClipboard from './CopyClipboard'
import modalEnhancer from 'components/providers/ModalEnhancer'

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
      <Text id='modals.qrcode.scan' text='Scan QR Code' small light />
      <QRCodeContainer>
        <QRCodeReact value={bitcoinAddress} size={256} />
      </QRCodeContainer>
      <CopyClipboard address={bitcoinAddress} />
      <Footer>
        <Link onClick={handleBack}>
          <Text id='modals.qrcode.back' text='Go back' small light cyan />
        </Link>
      </Footer>
    </Modal>
  )
}

QRCode.propTypes = {
  address: PropTypes.string.isRequired,
  handleBack: PropTypes.func
}

let enhance = modalEnhancer('QRCode')

export default enhance(QRCode)
