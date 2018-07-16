import React, { Component } from 'react'
import modalEnhancer from 'providers/ModalEnhancer'
import ShowXPubTemplate from './template'

class ShowXPubContainer extends Component {
  constructor (props) {
    super(props)
    this.state = { step: 0 }
  }

  render () {
    let { step } = this.state
    let nextStep = () => this.setState({ step: 1 })
    return (<ShowXPubTemplate {...this.props} step={step} onContinue={nextStep} />)
  }
}

export default modalEnhancer('ShowXPub')(ShowXPubContainer)
