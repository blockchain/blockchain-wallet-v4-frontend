import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Btc from '@ledgerhq/hw-app-btc'
import Transport from '@ledgerhq/hw-transport-u2f'

// MOVE ALL OF THIS
// ----------------
import { fromPublicKey } from 'bip32'
import { HDNode } from 'bitcoinjs-lib'
import { compressPublicKey } from 'blockchain-wallet-v4/src/utils/btc'

import EthHd from 'ethereumjs-wallet/hdkey'
import EthUtil from 'ethereumjs-util'
// ----------------

import { actions } from 'data'
import Lockbox from './template.js'
import { getData } from './selectors'

// MOVE ALL OF THIS
// ----------------
const getXpub = (publicKey, chainCode) => {
  const compressedPublicKey = compressPublicKey(Buffer.from(publicKey, 'hex'))
  const bip32 = fromPublicKey(
    compressedPublicKey,
    Buffer.from(chainCode, 'hex')
  )
  return bip32.toBase58()
}
// ----------------

class LockboxContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      connecting: false,
      deviceInfo: {},
      error: false
    }
    this.launchCarbonSetup = this.launchCarbonSetup.bind(this)
    this.getDeviceInfo = this.getDeviceInfo.bind(this)
    this.deriveXpubs = this.deriveXpubs.bind(this)
  }

  async getDeviceInfo () {
    try {
      this.setState({ connecting: true, error: false })
      const transport = await Transport.create()
      const lockbox = new Btc(transport)
      // get public key and chaincode for btc and eth paths
      // btc bip44 path is m/44'/0'/0'/0
      const btcResult = await lockbox.getWalletPublicKey("44'/0'/0'/0'")
      // eth bip44 path is m/44'/60'/0'/0
      const ethResult = await lockbox.getWalletPublicKey("44'/60'/0'/0")
      this.setState({
        deviceInfo: {
          btc: btcResult,
          eth: ethResult
        },
        connecting: false
      })
    } catch (e) {
      this.setState({ connecting: false, error: e })
    }
  }
  // MOVE ALL OF THIS
  // ----------------
  async deriveXpubs () {
    const { deviceInfo } = this.state
    const { btc, eth } = deviceInfo

    const btcXpub = getXpub(btc.publicKey, btc.chainCode)
    const btcAddr = HDNode.fromBase58(btcXpub).getAddress()

    const ethXpub = getXpub(eth.publicKey, eth.chainCode)
    const ethPublic = EthHd.fromExtendedKey(ethXpub)
      .derivePath('0/0')
      .getWallet()
      .getPublicKey()
    const ethAddr = EthUtil.toChecksumAddress(
      EthUtil.publicToAddress(ethPublic).toString('hex')
    )
    this.setState({
      xpubInfo: {
        btc: { xpub: btcXpub, addr: btcAddr },
        eth: { xpub: ethXpub, addr: ethAddr }
      }
    })
  }
  // ----------------

  launchCarbonSetup () {
    this.props.modalActions.showModal('LockboxSetup')
  }

  render () {
    return (
      <Lockbox
        launchCarbonSetup={this.launchCarbonSetup}
        getDeviceInfo={this.getDeviceInfo}
        deriveXpubs={this.deriveXpubs}
        {...this.state}
      />
    )
  }
}

const mapStateToProps = state => ({
  data: getData(state)
})

const mapDispatchToProps = dispatch => ({
  modalActions: bindActionCreators(actions.modals, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LockboxContainer)
