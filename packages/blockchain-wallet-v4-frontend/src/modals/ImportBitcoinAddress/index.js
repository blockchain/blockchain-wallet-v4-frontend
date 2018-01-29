import React from 'react'
import { compose } from 'redux'
import modalEnhancer from 'providers/ModalEnhancer'
import ImportBitcoinAddress from './template.js'

class ImportBitcoinAddressContainer extends React.Component {
  render () {
    return <ImportBitcoinAddress {...this.props} onSubmit={this.onSubmit} />
  }
}

const enhance = compose(modalEnhancer('ImportBitcoinAddress'))

export default enhance(ImportBitcoinAddressContainer)
