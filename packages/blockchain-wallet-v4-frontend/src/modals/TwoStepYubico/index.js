import React from 'react'

import modalEnhancer from 'providers/ModalEnhancer'
import TwoStepYubico from './template.js'

class TwoStepYubicoContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick () {

  }

  render () {
    return (
      <TwoStepYubico {...this.props} handleClick={this.handleClick} />
    )
  }
}

export default modalEnhancer('TwoStepYubico')(TwoStepYubicoContainer)
