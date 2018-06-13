import React from 'react'
import modalEnhancer from 'providers/ModalEnhancer'
import Welcome from './template.js'

class WelcomeContainer extends React.PureComponent {
  render () {
    return (
      <Welcome {...this.props} />
    )
  }
}

export default modalEnhancer('Welcome')(WelcomeContainer)
