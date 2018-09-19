import React from 'react'

import BitcoinLinkHandling from './template.js'

class BitcoinLinkHandlingContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = { warningDisplayed: false }
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick () {
    this.setState({ warningDisplayed: !this.state.warningDisplayed })
    // Register bitcoin links
    window.navigator.registerProtocolHandler(
      'bitcoin',
      '/open/%s',
      'Blockchain'
    )
  }

  render () {
    return (
      <BitcoinLinkHandling
        warningDisplayed={this.state.warningDisplayed}
        handleClick={this.handleClick}
      />
    )
  }
}

export default BitcoinLinkHandlingContainer
