import QRCodeWrapper from 'components/QRCode/Wrapper'
import React from 'react'

const PairingCode = props => {
  const { val } = props
  return <QRCodeWrapper value={val} size={256} />
}

export default PairingCode
