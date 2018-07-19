import React from 'react'
import Btc from '@ledgerhq/hw-app-btc'
import Transport from '@ledgerhq/hw-transport-u2f'

import Lockbox from './template.js'

class LockboxContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      btcInfo: null
    }
    this.getBtcAddress = this.getBtcAddress.bind(this)
    this.deriveXpubs = this.deriveXpubs.bind(this)
  }

  componentDidMount () {
    // this.props.loginActions.initialized()
  }

  async getBtcAddress () {
    const transport = await Transport.create()
    const btc = new Btc(transport)
    const result = await btc.getWalletPublicKey("44'/0'/0'/0/0")
    this.setState({ btcInfo: result })
  }

  async deriveXpubs () {}

  render () {
    return (
      <Lockbox
        getBtcAddress={this.getBtcAddress}
        deriveXpubs={this.deriveXpubs}
        btcInfo={this.state.btcInfo}
      />
    )
  }
}

export default LockboxContainer
