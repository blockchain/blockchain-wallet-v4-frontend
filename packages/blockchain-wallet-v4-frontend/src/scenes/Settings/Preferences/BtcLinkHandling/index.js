import React from 'react'

import BitcoinLinkHandling from './template.js'

class BitcoinLinkHandlingContainer extends React.PureComponent {
  state = { warningDisplayed: false }

  handleClick = () => {
    this.setState({ warningDisplayed: !this.state.warningDisplayed })
    // Register bitcoin links
    window.navigator.registerProtocolHandler(
      'bitcoin',
      '/#/open/%s',
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
