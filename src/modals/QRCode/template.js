import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import QRCode from 'qrcode-react'

import Modal from 'components/generic/Modal'

const QRCodeContainer = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;
  width: 100;
`

const QRCodeStep = (props) => {
  let bitcoinAddress = `bitcoin:${props.address}`
  return (
    <Modal icon='icon-receive' title='Qr code' size='large' show={props.show}>
      <QRCodeContainer>
        <QRCode value={bitcoinAddress} size={256} />
      </QRCodeContainer>
    </Modal>
  )
}

QRCodeStep.defaultProps = {
  show: false
}

QRCodeStep.propTypes = {
  show: PropTypes.bool.isRequired
}

export default QRCodeStep
