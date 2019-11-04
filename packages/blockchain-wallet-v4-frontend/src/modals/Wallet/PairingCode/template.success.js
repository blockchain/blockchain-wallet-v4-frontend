import QRCodeWrapper from 'components/QRCodeWrapper'
import React from 'react'

const PairingCode = props => {
  const { val } = props
  return <QRCodeWrapper value={val} size={256} />
}

export default PairingCode
