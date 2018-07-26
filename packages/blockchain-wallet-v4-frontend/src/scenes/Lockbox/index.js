import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Btc from '@ledgerhq/hw-app-btc'
import Transport from '@ledgerhq/hw-transport-u2f'

import { actions } from 'data'
import Lockbox from './template.js'

class LockboxContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      connected: false,
      connecting: false,
      deviceInfo: {},
      error: false
    }
    this.launchCarbonSetup = this.launchCarbonSetup.bind(this)
    this.getBtcAddress = this.getBtcAddress.bind(this)
    this.deriveXpubs = this.deriveXpubs.bind(this)
  }

  async getBtcAddress () {
    try {
      this.setState({ connecting: true, error: false })
      const transport = await Transport.create()
      const btc = new Btc(transport)
      const result = await btc.getWalletPublicKey("44'/0'/0'/0/0")
      this.setState({ deviceInfo: result, connecting: false })
    } catch (e) {
      this.setState({ connecting: false, error: e })
    }
  }

  async deriveXpubs () {}

  launchCarbonSetup () {
    this.props.modalActions.showModal('SetupCarbon')
  }

  render () {
    return (
      <Lockbox
        launchCarbonSetup={this.launchCarbonSetup}
        getBtcAddress={this.getBtcAddress}
        deriveXpubs={this.deriveXpubs}
        {...this.state}
      />
    )
  }
}

const mapDispatchToProps = dispatch => ({
  modalActions: bindActionCreators(actions.modals, dispatch)
})

export default connect(
  null,
  mapDispatchToProps
)(LockboxContainer)
