import React from 'react'
import QRCodeReact from 'qrcode.react'

const PairingCode = (props) => {
  const { val } = props
  return (
    <QRCodeReact value={val} size={256} />
  )
}

export default PairingCode
