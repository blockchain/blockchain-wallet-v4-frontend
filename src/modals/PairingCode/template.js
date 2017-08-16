import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import QRCodeReact from 'qrcode-react'

import { Modal, SecondaryButton, Text } from 'blockchain-info-components'
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

const PairingCode = (props) => {
  const { data, handleClose, ...rest } = props

  return (
    <Modal {...rest} icon='icon-receive' title='Pairing code' size='large'>
      <Text id='modals.pairingcode.scan' text='Scan Pairing Code' small light />
      <QRCodeContainer>
        <QRCodeReact value={data} size={256} />
      </QRCodeContainer>
      <Footer>
        <SecondaryButton fullwidth onClick={handleClose}>
          <Text id='modals.pairingcode.close' text='Close' small light white />
        </SecondaryButton>
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
