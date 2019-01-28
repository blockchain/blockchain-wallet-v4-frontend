import React from 'react'
import modalEnhancer from 'providers/ModalEnhancer'
import Template from './template.js'

class BsvGetStarted extends React.PureComponent {
  render () {
    return <Template {...this.props} />
  }
}

export default modalEnhancer('BsvGetStarted')(BsvGetStarted)
