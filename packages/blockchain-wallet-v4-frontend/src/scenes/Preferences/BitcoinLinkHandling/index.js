
import React from 'react'
import ui from 'redux-ui'
import config from 'config'

import BitcoinLinkHandling from './template.js'

class BitcoinLinkHandlingContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick () {
    this.props.updateUI({ warningDisplayed: true })
    // Register bitcoin links
    // const link = `${config.ROOT_URL}a/%s`
    const link = 'http://localhost:8080/a/%s'
    console.log(link)
    window.navigator.registerProtocolHandler('bitcoin', link, 'Blockchain')
  }

  render () {
    return <BitcoinLinkHandling {...this.props} warningDisplayed={this.props.ui.warningDisplayed} handleClick={this.handleClick}
    />
  }
}
const enhance = ui({ key: 'BitcoinLinkHandling', state: { warningDisplayed: false } })

export default enhance(BitcoinLinkHandlingContainer)
