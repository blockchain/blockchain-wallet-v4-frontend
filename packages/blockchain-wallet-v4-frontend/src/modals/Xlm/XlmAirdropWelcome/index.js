import React from 'react'
import modalEnhancer from 'providers/ModalEnhancer'
import AirdropWelcome from './template.js'

class AirdropWelcomeContainer extends React.PureComponent {
  render () {
    return <AirdropWelcome {...this.props} />
  }
}

export default modalEnhancer('AirdropWelcome')(AirdropWelcomeContainer)
