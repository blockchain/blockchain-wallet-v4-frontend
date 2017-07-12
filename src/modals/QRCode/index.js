import React from 'react'

import QRCode from './template.js'

class QRCodeContainer extends React.Component {
  render () {
    return <QRCode show={this.props.show} address={this.props.address} />
  }
}

export default QRCodeContainer
