
import React from 'react'
import ui from 'redux-ui'
import config from 'config'

import BitcoinLinkHandling from './template.js'

class BitcoinLinkHandlingContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick () {
    this.props.updateUI({ warningDisplayed: true })
    // Register bitcoin links
    window.navigator.registerProtocolHandler('bitcoin', `${config.ROOT_URL}a/%s`, 'Blockchain')
  }

  render () {
    return <BitcoinLinkHandling warningDisplayed={this.props.ui.warningDisplayed} handleClick={this.handleClick}
    />
  }
}
const enhance = ui({ key: 'BitcoinLinkHandling', state: { warningDisplayed: false } })

export default enhance(BitcoinLinkHandlingContainer)
