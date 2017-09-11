import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import QRCodeReact from 'qrcode-react'

import { Button, Modal } from 'blockchain-info-components'
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

const PairingCode = (props) => {
  const { data, handleClose, ...rest } = props

  return (
    <Modal {...rest} icon='request' title='Pairing code' size='large'>
      <FormattedMessage id='modals.pairingcode.scan' defaultMessage='Scan Pairing Code' />
      <QRCodeContainer>
        <QRCodeReact value={data} size={256} />
      </QRCodeContainer>
      <Footer>
        <Button nature='secondary' fullwidth onClick={handleClose}>
          <FormattedMessage id='modals.pairingcode.close' defaultMessage='Close' />
        </Button>
      </Footer>
    </Modal>
  )
}

PairingCode.propTypes = {
  data: PropTypes.string.isRequired,
  handleClose: PropTypes.func
}

const enhance = modalEnhancer('PairingCode')

export default enhance(PairingCode)
