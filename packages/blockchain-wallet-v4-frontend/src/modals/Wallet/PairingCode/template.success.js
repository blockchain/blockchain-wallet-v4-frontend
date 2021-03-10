import React from 'react'

import QRCodeWrapper from 'components/QRCode/Wrapper'

const PairingCode = props => {
  const { val } = props
  return <QRCodeWrapper value={val} size={256} />
}

export default PairingCode
