import { bitcoin } from '../../redux/common/selectors'
import Bitcoin from 'bitcoinjs-lib'

export class ExchangeDelegate {
  constructor (state, api) {
    this._trades = []
    this._debug = false
    this.labelBase = 'Exchange order'
    this._state = state
    this._api = api
  }

  get state () {
    return this._state
  }

  get trades () {
    return this._trades
  }

  get api () {
    return this._api
  }

  save () {
    return Promise.resolve() // CHEAT: save metadata in rootSaga
  }

  email () {
    return this._state.settingsPath.data.email
  }

  mobile () {
    return this._state.settingsPath.data.sms_number
  }

  isEmailVerified () {
    return this._state.settingsPath.data.email_verified
  }

  isMobileVerified () {
    return this._state.settingsPath.data.sms_verified
  }

  getToken (partner, options) {
    options = options || {}

    const guid = this.state.walletPath.wallet.guid
    const sharedKey = this.state.walletPath.wallet.sharedKey

    let fields = {
      guid: guid,
      sharedKey: sharedKey,
      fields: `email${options.mobile ? '|mobile' : ''}${options.walletAge ? '|wallet_age' : ''}`
    }

    if (partner) {
      fields.partner = partner
    }

    return this.api.getTokenForDelegate(fields)
      .then(function (res) {
        if (res.success) {
          return res.token
        } else {
          throw new Error('Unable to obtain email & mobile verification proof')
        }
      })
  }

  monitorAddress (address, callback) {
    // TODO: monitor address
    console.log('Monitor address: ' + address)
  }

  checkAddress (address) {
    // TODO: implement check address
  }

  getReceiveAddress (trade) {
    // TODO: getReceiveAddress
  }

  findLastExchangeIndex () {
    // TODO: implement findLastExchangeIndex
  }

  reserveReceiveAddress () {
    const receiveAddress = bitcoin.getNextAvailableReceiveAddress(Bitcoin.networks.bitcoin.NETWORK_BITCOIN, 0, this.state)
    return {
      // receiveAddress: '2N7FwMpgyXQA85SaVXumm3UZowq2VKChehP', // receiveAddress.data for now testnet address used on staging
      receiveAddress: receiveAddress.data,
      commit: (trade) => {}
    }
  }

  releaseReceiveAddress (trade) {
    // console.log('delegate.releaseReceiveAddress', trade)
    // TODO: releaseReceiveAddress
  }

  serializeExtraFields (obj, trade) {
    obj.account_index = trade._account_index
    obj.receive_index = trade._receive_index
  }

  deserializeExtraFields (obj, trade) {
    trade._account_index = obj.account_index
    trade._receive_index = obj.receive_index
  }
}

module.exports = ExchangeDelegate
