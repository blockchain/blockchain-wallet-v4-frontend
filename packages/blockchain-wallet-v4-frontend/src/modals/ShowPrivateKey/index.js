import React, { Component } from 'react'
import modalEnhancer from 'providers/ModalEnhancer'
import ShowPrivateKeyTemplate from './template'

class ShowPrivateKeyContainer extends Component {
  constructor (props) {
    super(props)
    this.state = { step: 1 }
  }

  render () {
    let { step } = this.state
    let nextStep = () => this.setState({ step: 1 })
    return (<ShowPrivateKeyTemplate {...this.props} step={step} onContinue={nextStep} />)
  }
}

export default modalEnhancer('ShowPrivateKey')(ShowPrivateKeyContainer)
