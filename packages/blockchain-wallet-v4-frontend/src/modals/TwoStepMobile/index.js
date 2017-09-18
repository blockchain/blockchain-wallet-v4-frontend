import React from 'react'

import modalEnhancer from 'providers/ModalEnhancer'
import TwoStepMobile from './template.js'

class TwoStepMobileContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick () {
    
  }

  render () {
    return (
      <TwoStepMobile {...this.props} handleClick={this.handleClick} />
    )
  }
}

export default modalEnhancer('TwoStepMobile')(TwoStepMobileContainer)
