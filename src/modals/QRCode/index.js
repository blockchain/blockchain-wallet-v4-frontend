import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import QRCodeReact from 'qrcode-react'

import { Link } from 'components/generic/Link'
import { Text } from 'components/generic/Text'
import Modal from 'components/generic/Modal'
import CopyClipboard from './CopyClipboard'

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
  const { show, payload } = props
  const { address, back } = payload
  const bitcoinAddress = `bitcoin:${address}`

  return (
    <Modal icon='icon-receive' title='Payment address' size='large' show={show}>
      <Text id='modals.qrcode.scan' text='Scan QR Code' small light />
      <QRCodeContainer>
        <QRCodeReact value={bitcoinAddress} size={256} />
      </QRCodeContainer>
      <CopyClipboard address={bitcoinAddress} />
      { back &&
      <Footer>
        <Link onClick={back}>
          <Text id='modals.qrcode.back' text='Go back' small light cyan />
        </Link>
      </Footer>
      }
    </Modal>
  )
}

QRCode.defaultProps = {
  show: false
}

QRCode.propTypes = {
  show: PropTypes.bool.isRequired,
  payload: PropTypes.shape({
    address: PropTypes.string.isRequired,
    back: PropTypes.func
  })
}

export default QRCode
