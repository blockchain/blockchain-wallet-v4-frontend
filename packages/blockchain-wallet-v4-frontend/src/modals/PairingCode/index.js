import React from 'react'

import modalEnhancer from 'providers/ModalEnhancer'
import PairingCode from './template.js'

class PairingCodeContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick () {
    this.props.close()
  }

  render () {
    return <PairingCode {...this.props} handleClick={this.handleClick} />
  }
}

export default modalEnhancer('PairingCode')(PairingCodeContainer)
