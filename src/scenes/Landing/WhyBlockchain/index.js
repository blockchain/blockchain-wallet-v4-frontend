import React from 'react'

import WhyBlockchain from './template.js'

class WhyBlockchainContainer extends React.Component {
  constructor (props) {
    super(props)
    this.state = { slide1: true, slide2: false }
    this.clickPage1 = this.clickPage1.bind(this)
    this.clickPage2 = this.clickPage2.bind(this)
  }

  clickPage1 () { this.setState({ slide1: true, slide2: false }) }
  clickPage2 () { this.setState({ slide1: false, slide2: true }) }

  render () {
    return (
      <WhyBlockchain slide1={this.state.slide1} slide2={this.state.slide2} clickPage1={this.clickPage1} clickPage2={this.clickPage2} />
    )
  }
}

export default WhyBlockchainContainer
