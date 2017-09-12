import React from 'react'

import modalEnhancer from 'providers/ModalEnhancer'
import QrCode from './template.js'

class QrCodeContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleBack = this.handleBack.bind(this)
  }

  handleBack () {
    this.props.close()
  }

  render () {
    return <QrCode {...this.props} handleBack={this.handleBack} />
  }
}

export default modalEnhancer('QRCode')(QrCodeContainer)
