import React from 'react'

import modalEnhancer from 'providers/ModalEnhancer'
import TwoStepGoogleAuthenticator from './template.js'

class TwoStepGoogleAuthenticatorContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick () {

  }

  render () {
    return (
      <TwoStepGoogleAuthenticator {...this.props} handleClick={this.handleClick} />
    )
  }
}

export default modalEnhancer('TwoStepGoogleAuthenticator')(TwoStepGoogleAuthenticatorContainer)
